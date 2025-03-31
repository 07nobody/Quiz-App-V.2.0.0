import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Skeleton, Empty, Spin, Statistic, Divider, Alert, Typography } from 'antd';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  TrophyOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  RiseOutlined,
  BookOutlined,
} from '@ant-design/icons';
import { getUserProgress } from '../apicalls/users';

const { Title, Text } = Typography;

// Color palette for charts
const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];

const UserProgressDashboard = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setLoading(true);
        const response = await getUserProgress(userId);
        
        if (response.success) {
          setProgressData(response.data);
        } else {
          setError(response.message || 'Failed to fetch progress data');
        }
      } catch (err) {
        setError('An error occurred while fetching your progress data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProgressData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Spin size="large" />
        <p style={{ marginTop: '1rem' }}>Loading your analytics...</p>
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!progressData) {
    return <Empty description="No progress data available" />;
  }

  // Format data for charts
  const formatTrendsForChart = (trends, label) => {
    if (!trends || !Array.isArray(trends)) return [];
    return trends.map((value, index) => ({
      name: `Quiz ${index + 1}`,
      [label]: value
    }));
  };

  // Format category performance for radar chart
  const formatCategoryData = () => {
    if (!progressData.categoryPerformance) return [];
    
    return Object.entries(progressData.categoryPerformance).map(([category, value]) => ({
      subject: category,
      A: value * 100, // Convert to percentage
      fullMark: 100,
    }));
  };

  // Format topic strengths for pie chart
  const formatTopicStrengths = () => {
    if (!progressData.topicStrengths) return [];
    
    return Object.entries(progressData.topicStrengths).map(([topic, value], index) => ({
      name: topic,
      value: value * 100, // Convert to percentage
      color: COLORS[index % COLORS.length]
    }));
  };

  return (
    <div className="user-progress-dashboard">
      <Title level={4} style={{ marginBottom: '24px' }}>Your Learning Analytics</Title>

      {/* Key Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Quizzes Completed" 
              value={progressData.stats?.quizzesCompleted || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Current Streak" 
              value={progressData.currentStreak || 0}
              prefix={<FireOutlined style={{ color: '#f5222d' }} />}
              suffix="days"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Accuracy Rate" 
              value={(progressData.stats?.accuracyRate || 0) * 100}
              precision={1}
              prefix={<RiseOutlined style={{ color: '#1890ff' }} />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Level" 
              value={progressData.level || 1}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Progress Charts */}
      <Row gutter={[16, 16]}>
        {/* Accuracy Trend Chart */}
        <Col xs={24} lg={12}>
          <Card title="Accuracy Trend" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={formatTrendsForChart(progressData.trends?.accuracy, 'accuracy')}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#1890ff" 
                  activeDot={{ r: 8 }} 
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Score Trend Chart */}
        <Col xs={24} lg={12}>
          <Card title="Score Trend" className="chart-card">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={formatTrendsForChart(progressData.trends?.score, 'score')}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="score" 
                  fill="#52c41a" 
                  name="Score" 
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Category Performance Radar Chart */}
        <Col xs={24} lg={12}>
          <Card title="Subject Performance" className="chart-card">
            {progressData.categoryPerformance && Object.keys(progressData.categoryPerformance).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius={90} data={formatCategoryData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, 'Performance']} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="No subject performance data available yet" />
            )}
          </Card>
        </Col>

        {/* Topic Strengths Pie Chart */}
        <Col xs={24} lg={12}>
          <Card title="Topic Strengths" className="chart-card">
            {progressData.topicStrengths && Object.keys(progressData.topicStrengths).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={formatTopicStrengths()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {formatTopicStrengths().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Proficiency']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="No topic strength data available yet" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Learning Recommendations */}
      <Card title="Learning Recommendations" style={{ marginTop: '24px' }}>
        {progressData.recommendations && progressData.recommendations.length > 0 ? (
          <ul className="recommendation-list">
            {progressData.recommendations.map((rec, index) => (
              <li key={index} className="recommendation-item">
                <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                {rec}
              </li>
            ))}
          </ul>
        ) : (
          <Text>
            Complete more quizzes to get personalized learning recommendations based on your performance.
          </Text>
        )}
      </Card>

      <style jsx="true">{`
        .chart-card {
          height: 380px;
        }
        
        .recommendation-list {
          list-style: none;
          padding-left: 0;
          margin-bottom: 0;
        }
        
        .recommendation-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .recommendation-item:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default UserProgressDashboard;