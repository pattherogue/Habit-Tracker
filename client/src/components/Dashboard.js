import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, ListGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HabitForm from './HabitForm';
import { fetchHabits, createHabit, getUserData, getHabitStatistics } from '../services/api';
import { Chart } from "react-google-charts";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  const [statistics, setStatistics] = useState({ 
    today: { completionRate: 0 }, 
    overall: { completionRate: 0 } 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [habitsData, userData, statsData] = await Promise.all([
        fetchHabits(),
        getUserData(),
        getHabitStatistics()
      ]);
      setHabits(habitsData);
      setUserName(userData.name);
      setStatistics(statsData);
      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
    }
    setLoading(false);
  };

  const handleCreateHabit = async (habitData) => {
    try {
      await createHabit(habitData);
      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error('Error creating habit:', error);
      setError('Failed to create habit. Please try again.');
    }
  };

  const formatCompletionRate = (rate) => {
    return typeof rate === 'number' ? rate.toFixed(2) : '0.00';
  };

  if (loading) {
    return <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>;
  }

  return (
    <Container>
      <h1 className="my-4">Welcome, {userName}!</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Today's Progress</Card.Title>
              <Card.Text className="display-4">{formatCompletionRate(statistics.today.completionRate)}%</Card.Text>
              <Card.Text>of habits completed</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Overall Progress</Card.Title>
              <Card.Text className="display-4">{formatCompletionRate(statistics.overall.completionRate)}%</Card.Text>
              <Card.Text>of habits completed</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <h2>Your Habits</h2>
          {habits.length === 0 ? (
            <Alert variant="info">You haven't created any habits yet. Start by adding a new habit!</Alert>
          ) : (
            <ListGroup>
              {habits.map(habit => (
                <ListGroup.Item key={habit.id} className="d-flex justify-content-between align-items-center">
                  <span>{habit.name}</span>
                  <div>
                    <Button variant="outline-primary" size="sm" className="mr-2" as={Link} to={`/habit/${habit.id}`}>
                      View Details
                    </Button>
                    <Button variant="outline-success" size="sm" onClick={() => updateHabitProgress(habit.id, {completed: true})}>Mark Complete</Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
          <Button onClick={() => setShowForm(!showForm)} className="mt-3">
            {showForm ? 'Cancel' : 'Add New Habit'}
          </Button>
          {showForm && <HabitForm onSubmit={handleCreateHabit} />}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Habit Completion Rates</Card.Title>
              {habits.length === 0 ? (
                <Alert variant="info">Add habits to see completion rates.</Alert>
              ) : (
                <Chart
                  width={'100%'}
                  height={'300px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Habit', 'Completion Rate'],
                    ...habits.map(habit => [habit.name, habit.completionRate || 0])
                  ]}
                  options={{
                    title: 'Habit Completion Rates',
                    is3D: true,
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
