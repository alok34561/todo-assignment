const axios = require('axios');

// Test publishing a task event
const testEvent = {
  event: 'task.created',
  data: {
    task: {
      id: 999,
      title: 'Test Task',
      description: 'This is a test task for real-time functionality',
      status: 'pending',
      user: { id: 1, name: 'Test User', email: 'test@example.com' }
    }
  }
};

console.log('Sending test event to Socket server...');
axios.post('http://localhost:3001/webhook/task-event', testEvent)
  .then(() => {
    console.log('Test event sent successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error sending test event:', error.message);
    process.exit(1);
  });