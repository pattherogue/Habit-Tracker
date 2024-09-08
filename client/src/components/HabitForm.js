import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function HabitForm({ onSubmit, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [frequency, setFrequency] = useState(initialData?.frequency || 'daily');
  const [goal, setGoal] = useState(initialData?.goal || '');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Habit name cannot be empty');
      return;
    }
    onSubmit({ name, frequency, goal });
    if (!initialData) {
      setName('');
      setFrequency('daily');
      setGoal('');
    }
    setError(null);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="habitName">
        <Form.Label>Habit Name</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter habit name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="habitFrequency">
        <Form.Label>Frequency</Form.Label>
        <Form.Control 
          as="select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="habitGoal">
        <Form.Label>Goal</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter your goal" 
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        {initialData ? 'Update Habit' : 'Create Habit'}
      </Button>
    </Form>
  );
}

export default HabitForm;