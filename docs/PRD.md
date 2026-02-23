# Product Requirements Document (PRD): AI Hybrid Trader B3

## 1. Objetivo do Projeto
Desenvolver um ecossistema de suporte à decisão para Swing Trade na B3, integrando inteligência artificial (Deep Learning), análise fundamentalista rigorosa e filtros estatísticos quantitativos. O sistema visa identificar sinais de alta probabilidade com foco em preservação de capital e gestão de risco automatizada.

## 2. Arquitetura e Stack Técnica
- Modelo de Desenvolvimento: Monorepo.
- Gerenciador de Pacotes: uv (Astral) - Escolhido pela velocidade extrema e gerenciamento preciso de uv.lock para dependências pesadas (TensorFlow).
- Backend: FastAPI (Python 3.10+).
- Frontend: Next.js + TypeScript + Tailwind CSS + Shadcn UI.
- IA/ML: TensorFlow/Keras para a LSTM.
- Banco de Dados: PostgreSQL para histórico de sinais e auditoria.
- Provedor Cloud: AWS (EC2/App Runner + ECR).

## 3. Engenharia de Dados (ETL & Features)

### 3.1 Fonte de Dados
- Primária: Yahoo Finance (yfinance).
- Suffix: Obrigatório uso de .SA para ativos da B3.
- Período: Gráfico Diário (D1) para análise principal; Horário (H1) para refinamento de execução.

### 3.2 As 12 Features (Indicadores Técnicos)
- A rede neural deve receber exatamente estes 12 indicadores não-colineares:
- Adj Close: Fechamento ajustado (Base para retornos).
- Volume: Volume financeiro normalizado.
- RSI (IFR): Momentum de 14 períodos.
- Distância SMA 200: Porcentagem de afastamento da média móvel de 200 dias.
- Banda Superior de Bollinger: Teto de volatilidade (20 períodos, 2 desvios).
- Banda Inferior de Bollinger: Piso de volatilidade.
- MACD Line: Diferença de médias rápidas/lentas.
- MACD Histogram: Aceleração da tendência.
- ADX: Força da tendência (independente da direção).
- Stochastic Oscillator (%K): Timing de reversão em zonas de sobrevenda.
- ATR (Average True Range): Medição de volatilidade para cálculo de stops.
- OBV (On-Balance Volume): Confirmação de fluxo de acumulação/distribuição.

## 4. Configuração Detalhada da Rede Neural (LSTM)
Esta seção serve como instrução direta para o Cursor implementar o modelo.

### 4.1 Pré-processamento
- Janela Temporal (Lookback): 60 períodos (dias úteis).
- Normalização: Os dados de preço devem ser convertidos para Log Returns e escalonados via MinMaxScaler ou StandardScaler no intervalo [0, 1] ou [-1, 1] para evitar gradientes explosivos.
- Target: Classificação Binária. 1 se o retorno em T+5 (5 dias à frente) for >X% (ex: 2%), 0 caso contrário.

### 4.2 Arquitetura do Modelo
- Input Layer: Shape (60, 12) (60 dias, 12 indicadores).
- LSTM Layer 1: 64 a 128 unidades, return_sequences=True.
- Dropout Layer: 0.2 (20%) para mitigar overfitting.
- LSTM Layer 2: 32 a 64 unidades, return_sequences=False.
- Dense Layer: 16 neurônios com ativação ReLU.
- Output Layer: 1 neurônio com ativação Sigmoid (Saída: probabilidade entre 0 e 1).

### 4.3 Treinamento
- Loss Function: binary_crossentropy.
- Optimizer: Adam com learning rate inicial de 0.001.
- Métrica Principal: Precision (Minimizar falsos positivos é mais importante que capturar todos os ganhos).

## 5. O Conselho de Agentes (Lógica de Confluência)
O sinal de compra só é validado se houver consenso entre os seguintes módulos:

### 5.1 Analista Técnico (LSTM): Emite sinal baseado na probabilidade de tendência de alta.

### 5.2 Agente Estatístico Quant:
- Z-Score: Valida se o preço não está esticado estatisticamente (veta se Z-Score > 2.0).
- Correlação: Veta se o portfólio já estiver exposto a ativos com correlação > 0.85.
- Sharpe Ratio: Avalia o risco-retorno histórico do ativo.

### 5.3 Analista Fundamentalista:
- Filtra apenas empresas com ROE positivo, Dívida Bruta/EBITDA < 3x e lucro crescente nos últimos 4 trimestres.

### 5.4 Analista de Risco:
- Calcula o tamanho da mão (Position Sizing) baseado na volatilidade (ATR).
- Define Stop Loss e Take Profit estatísticos.

### 5.5 Curador (LLM):
- Recebe os dados brutos de todos os agentes e gera um parecer final humanizado para o usuário (Explainable AI).

## 6. Estrutura do Repositório (Monorepo)
```plaintext
/root
├── .cursor                # Instruções de comportamento para o Cursor
├── backend/               # FastAPI + uv
│   ├── analysts/          # Lógica dos Agentes (technical.py, quant.py, etc)
│   ├── shared/            # logger.py, exceptions.py, types.py (Pydantic)
│   ├── repositories/      # Abstração de dados (asset_repository.py)
│   └── main.py            # Entrypoint FastAPI
├── frontend/              # Next.js + TypeScript
├── infra/                 # Docker, Terraform, AWS Config
└── docs/                  # PRD.md, API_Spec.md
```


## 7. Notas de Decisão (Racional)
- Por que D1? Para reduzir ruído de mercado e alinhar com dados fundamentais trimestrais.
- Por que no-Open? Preço de abertura é ruidoso (gaps). O Fechamento Ajustado reflete a convicção final do mercado.
- Por que Repository Pattern? Para permitir a troca da fonte de dados (ex: de yfinance para uma API paga) sem alterar a lógica dos agentes.
- Por que uv? Redução do tempo de build em ambiente AWS e consistência absoluta de ambiente.

> **Instruções para o Cursor:**  
> Sempre que iniciar uma tarefa, utilize o @PRD.md como contexto. Siga rigorosamente a estrutura de pastas e as convenções de código definidas na seção 6. Não tome decisões arquiteturais que desviem deste documento sem consultar o usuário.
