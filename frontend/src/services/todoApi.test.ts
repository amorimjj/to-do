import axios, { AxiosInstance } from 'axios';
import { todoApi } from './todoApi';
import {
  CreateTodoRequest,
  PagedResponse,
  Todo,
  UpdateTodoRequest
} from '../types/todo';

jest.mock('axios', () => {
  const mockApi = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    }
  };
  return {
    create: jest.fn(() => mockApi),
    get: mockApi.get,
    post: mockApi.post,
    put: mockApi.put,
    patch: mockApi.patch,
    delete: mockApi.delete,
    interceptors: mockApi.interceptors
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockApiInstance = mockedAxios.create() as jest.Mocked<AxiosInstance>;

describe('todoApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('list calls get with correct params', async () => {
    const filters = { page: 1, pageSize: 10, priority: 'High' as const };
    const mockData: PagedResponse<Todo> = {
      items: [],
      totalCount: 0,
      totalPages: 0,
      page: 1,
      pageSize: 10
    };
    mockApiInstance.get.mockResolvedValueOnce({ data: mockData });

    const result = await todoApi.list(filters);

    expect(mockApiInstance.get).toHaveBeenCalledWith(
      '/todos',
      expect.objectContaining({
        params: expect.any(URLSearchParams)
      })
    );
    expect(result).toEqual(mockData);
  });

  test('create calls post with correct data', async () => {
    const request: CreateTodoRequest = {
      title: 'New Todo',
      priority: 'Medium' as const
    };
    const mockTodo: Todo = {
      id: '1',
      ...request,
      isCompleted: false,
      description: null,
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockApiInstance.post.mockResolvedValueOnce({ data: mockTodo });

    const result = await todoApi.create(request);

    expect(mockApiInstance.post).toHaveBeenCalledWith('/todos', request);
    expect(result).toEqual(mockTodo);
  });

  test('getById calls get with correct id', async () => {
    const id = '1';
    const mockTodo: Todo = {
      id,
      title: 'Existing Todo',
      description: null,
      priority: 'High',
      isCompleted: false,
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockApiInstance.get.mockResolvedValueOnce({ data: mockTodo });

    const result = await todoApi.getById(id);

    expect(mockApiInstance.get).toHaveBeenCalledWith(`/todos/${id}`);
    expect(result).toEqual(mockTodo);
  });

  test('update calls put with correct data', async () => {
    const id = '1';
    const request: UpdateTodoRequest = {
      title: 'Updated Title',
      description: 'Updated Description',
      priority: 'Low',
      isCompleted: true
    };
    const mockTodo: Todo = {
      id,
      ...request,
      description: request.description ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date().toISOString()
    };

    mockApiInstance.put.mockResolvedValueOnce({ data: mockTodo });

    const result = await todoApi.update(id, request);

    expect(mockApiInstance.put).toHaveBeenCalledWith(`/todos/${id}`, request);
    expect(result).toEqual(mockTodo);
  });

  test('toggle calls patch with correct id', async () => {
    const id = '1';
    const mockTodo: Todo = {
      id,
      title: 'Toggled Todo',
      description: null,
      priority: 'Medium',
      isCompleted: true,
      dueDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockApiInstance.patch.mockResolvedValueOnce({ data: mockTodo });

    const result = await todoApi.toggle(id);

    expect(mockApiInstance.patch).toHaveBeenCalledWith(`/todos/${id}/toggle`);
    expect(result).toEqual(mockTodo);
  });

  test('delete calls delete with correct id', async () => {
    const id = '1';
    mockApiInstance.delete.mockResolvedValueOnce({});

    await todoApi.delete(id);

    expect(mockApiInstance.delete).toHaveBeenCalledWith(`/todos/${id}`);
  });

  describe('summary', () => {
    test('calls GET /todos/summary and returns mapped camelCase when API returns PascalCase', async () => {
      mockApiInstance.get.mockResolvedValueOnce({
        data: { Total: 10, Completed: 3, Pending: 7 }
      });

      const result = await todoApi.summary();

      expect(mockApiInstance.get).toHaveBeenCalledWith('/todos/summary');
      expect(result).toEqual({
        total: 10,
        completed: 3,
        pending: 7,
        progress: 0.3
      });
    });

    test('returns camelCase when API already returns camelCase', async () => {
      mockApiInstance.get.mockResolvedValueOnce({
        data: { total: 5, completed: 2, pending: 3 }
      });

      const result = await todoApi.summary();

      expect(result).toEqual({
        total: 5,
        completed: 2,
        pending: 3,
        progress: 0.4
      });
    });

    test('defaults to zero when API returns empty or partial response', async () => {
      mockApiInstance.get.mockResolvedValueOnce({ data: {} });

      const result = await todoApi.summary();

      expect(result).toEqual({
        total: 0,
        completed: 0,
        pending: 0,
        progress: 0
      });
    });
  });

  describe('weeklySummary', () => {
    test('calls GET /todos/weekly-summary and returns mapped data when API returns PascalCase', async () => {
      const mockApiResponse = {
        Sunday: { Total: 1, Completed: 1 },
        Monday: { Total: 2, Completed: 0 },
        Tuesday: { Total: 3, Completed: 1 },
        Wednesday: { Total: 0, Completed: 0 },
        Thursday: { Total: 5, Completed: 5 },
        Friday: { Total: 1, Completed: 0 },
        Saturday: { Total: 2, Completed: 1 }
      };

      mockApiInstance.get.mockResolvedValueOnce({ data: mockApiResponse });

      const result = await todoApi.weeklySummary();

      expect(mockApiInstance.get).toHaveBeenCalledWith('/todos/weekly-summary');
      expect(result).toEqual({
        sunday: { total: 1, completed: 1 },
        monday: { total: 2, completed: 0 },
        tuesday: { total: 3, completed: 1 },
        wednesday: { total: 0, completed: 0 },
        thursday: { total: 5, completed: 5 },
        friday: { total: 1, completed: 0 },
        saturday: { total: 2, completed: 1 }
      });
    });

    test('returns camelCase when API already returns camelCase', async () => {
      const mockApiResponse = {
        sunday: { total: 1, completed: 1 },
        monday: { total: 2, completed: 0 },
        tuesday: { total: 3, completed: 1 },
        wednesday: { total: 0, completed: 0 },
        thursday: { total: 5, completed: 5 },
        friday: { total: 1, completed: 0 },
        saturday: { total: 2, completed: 1 }
      };

      mockApiInstance.get.mockResolvedValueOnce({ data: mockApiResponse });

      const result = await todoApi.weeklySummary();

      expect(result).toEqual({
        sunday: { total: 1, completed: 1 },
        monday: { total: 2, completed: 0 },
        tuesday: { total: 3, completed: 1 },
        wednesday: { total: 0, completed: 0 },
        thursday: { total: 5, completed: 5 },
        friday: { total: 1, completed: 0 },
        saturday: { total: 2, completed: 1 }
      });
    });

    test('defaults to zero values when API returns empty or partial response', async () => {
      mockApiInstance.get.mockResolvedValueOnce({ data: {} });

      const result = await todoApi.weeklySummary();

      const zeroDay = { total: 0, completed: 0 };
      expect(result).toEqual({
        sunday: zeroDay,
        monday: zeroDay,
        tuesday: zeroDay,
        wednesday: zeroDay,
        thursday: zeroDay,
        friday: zeroDay,
        saturday: zeroDay
      });
    });
  });
});
