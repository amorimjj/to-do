FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY ["src/TaskFlow.csproj", "./"]
RUN dotnet restore "TaskFlow.csproj"

# Copy all source folders
COPY src/ .

FROM build AS publish
# Build and publish
RUN dotnet publish "TaskFlow.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TaskFlow.dll"]
