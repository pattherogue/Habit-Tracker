import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { fetchHabitDetails, updateHabitProgress, updateHabit, deleteHabit } from '../services/api';
import { Chart } from "react-google-charts";
import HabitForm from './HabitForm';

function HabitDetail() {
  const [habit, setHabit] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  const history = useHistory();

  const loadHabitDetails = useCallback(async () => {
    try {
      const data = await fetchHabitDetails(id);
      setHabit(data);
      setError(null);
    } catch (error) {
      console.error('Error loading habit details:', error);
      setError('Failed to load habit details. Please try again.');
    }
  }, [id]);

  useEffect(() => {
    loadHabitDetails();
  }, [loadHabitDetails]);

  const handleMarkComplete = async () => {
    try {
      await updateHabitProgress(id, { completed: true, date: new Date() });
      loadHabitDetails();
    } catch (error) {
      console.error('Error updating habit progress:', error);
      setError('Failed to update habit progress. Please try again.');
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      await updateHabit(id, updatedData);
      setEditing(false);
      loadHabitDetails();
    } catch (error) {
      console.error('Error updating habit:', error);
      setError('Failed to update habit. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await deleteHabit(id);
        history.push('/dashboard');
      } catch (error) {
        console.error('Error deleting habit:', error);
        setError('Failed to delete habit. Please try again.');
      }
    }
  };

  if (!habit) return <div>Loading...</div>;

  const chartData = [
    ['Date', 'Completion'],
    ...(habit.progress && habit.progress.length > 0
      ? habit.progress.map(p => [new Date(p.date), p.completed ? 1 : 0])
      : [[new Date(), 0]]) // Add a default data point if there's no progress
  ];

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {!editing ? (
        <>
          <h1>{habit.name}</h1>
          <p>Frequency: {habit.frequency}</p>
          <p>Goal: {habit.goal}</p>
          <p>Current Streak: {habit.currentStreak} days</p>
          <p>Longest Streak: {habit.longestStreak} days</p>
          <Button onClick={() => setEditing(true)} className="mr-2">Edit</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </>
      ) : (
        <HabitForm onSubmit={handleUpdate} initialData={habit} />
      )}
      <Row className="mt-4">
        <Col md={8}>
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="Calendar"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={{
              title: `${habit.name} Completion`,
            }}
          />
        </Col>
        <Col md={4}>
          <Button onClick={handleMarkComplete}>Mark as Complete</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default HabitDetail;