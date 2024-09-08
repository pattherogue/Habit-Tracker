import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function HabitList({ habits }) {
  return (
    <ListGroup>
      {habits.map(habit => (
        <ListGroup.Item key={habit.id}>
          <Link to={`/habit/${habit.id}`}>{habit.name}</Link>
          <span className="float-right">
            Completion rate: {habit.completionRate || 0}%
          </span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default HabitList;