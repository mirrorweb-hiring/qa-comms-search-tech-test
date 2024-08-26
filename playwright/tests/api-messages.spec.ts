import { test, expect, APIRequestContext } from '@playwright/test';
import { apiLogin } from 'playwright/utils/helpers';

interface Message {
  id: string;
  subject: string;
  content: string;
  from_email: string;
  to_email: string;
  status: 'compliant' | 'non_compliant' | null;
  created_at: number;
}

test.describe('Message API Tests', () => {
  let apiContext: APIRequestContext;
  let cookie: string;

  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:8080',
    });    
    const response = await apiLogin(apiContext, 'example@example.com', 'asdf');
    cookie = response.cookie
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test('Retrieve a single message by ID', async () => {
    // First, get a list of messages to obtain a valid ID
    const listResponse = await apiContext.get('/messages', {
      headers: { Cookie: cookie }
    });
    const messages: Message[] = await listResponse.json();
    const messageId = messages[0].id;

    const response = await apiContext.get(`/messages/${messageId}`, {
      headers: { Cookie: cookie }
    });
    expect(response.ok()).toBeTruthy();
    const message: Message = await response.json();
    expect(message.id).toBe(messageId);
  });

  test('Retrieve messages and validate status', async () => {    
    const response = await apiContext.get('/messages', {
      headers: { Cookie: cookie }
    });
    expect(response.ok()).toBeTruthy();
    const messages = await response.json();
    expect(messages.length).toBeGreaterThan(0);

    // Validate that each message has a valid status
    messages.forEach((message: Message) => {
      expect(['compliant', 'non_compliant', null]).toContain(message.status);
    });
  });

  test('Messages are returned in ascending order by default', async () => {
    const response = await apiContext.get('/messages', {
      headers: { Cookie: cookie }
    });
    expect(response.ok()).toBeTruthy();
    const messages: Message[] = await response.json();

    expect(messages.length).toBeGreaterThan(1);

    // Check if messages are in ascending order by created_at
    for (let i = 1; i < messages.length; i++) {
      const previousTimestamp = new Date(messages[i-1].created_at * 1000).getTime();
      const currentTimestamp = new Date(messages[i].created_at * 1000).getTime();
      expect(currentTimestamp).toBeGreaterThanOrEqual(previousTimestamp);
    }
  });

  test('Update message status', async () => {    
    // First, get a message ID
    const messagesResponse = await apiContext.get('/messages', {
      headers: { Cookie: cookie }
    });
    const messages = await messagesResponse.json();
    const messageId = messages[0].id;
    
    // Update the status
    const updateResponse = await apiContext.put(`/messages/${messageId}`, {
      headers: { Cookie: cookie },
      data: { status: 'compliant' }
    });
    expect(updateResponse.ok()).toBeTruthy();
    
    // Verify the update
    const verifyResponse = await apiContext.get(`/messages/${messageId}`, {
      headers: { Cookie: cookie }
    });
    const updatedMessage = await verifyResponse.json();
    expect(updatedMessage.status).toBe('compliant');
  });
});