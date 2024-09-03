import React, { useEffect } from "react";
import {
  Row,
  Col,
  Statistic,
  notification,
  Progress,
  Badge,
  Card,
  Divider,
} from "antd";
import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";

const statusOptions = [
  { value: "Completed", color: "green" },
  { value: "Pending", color: "yellow" },
  { value: "Urgent", color: "red" },
  { value: "Overdue", color: "purple" },
];

const announcements = [
  {
    id: 1,
    user: "Danny George",
    date: "20/07/2024, 08:19 PM",
    message: "Happy Birthday Rohit!",
  },
  {
    id: 2,
    user: "Emily Johnson",
    date: "23/07/2024, 09:45 AM",
    message: "Congratulations on your promotion!",
  },
  {
    id: 3,
    user: "Michelle Davis",
    date: "25/07/2024, 02:30 PM",
    message: "Best wishes on your anniversary!",
  },
  {
    id: 4,
    user: "Alex Thompson",
    date: "27/07/2024, 05:15 PM",
    message: "Good luck on your new venture!",
  },
];

function HomeContentTeam() {
  const { currentUser } = useAuth();
  const {
    fetchWeeks,
    fetchAllTasksExceptLatest,
    fetchTasks,
    setLoading,
    state,
  } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchWeeks();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        notification.error({
          message: "Error fetching data",
          description: error.message,
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (state.weeks.length > 0 && state.activeSheet) {
        try {
          setLoading(true);
          await fetchTasks(state.activeSheet);
          await fetchAllTasksExceptLatest(state.weeks, state.activeSheet);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          notification.error({
            message: "Error fetching tasks",
            description: error.message,
          });
        }
      }
    };

    fetchTaskData();
  }, [state.activeSheet]);

  // Optimized task counting logic
  const statusCounts = {
    Total: 0,
    Completed: 0,
    Pending: 0,
    Urgent: 0,
    Overdue: 0,
  };
  const currentDate = new Date();
  if (state.tasks && state.tasks.length > 0) {
    state.tasks.forEach((item) => {
      item.tasks.forEach((task) => {
        const dueDate =
          task.dueDate && task.dueDate.toDate
            ? task.dueDate.toDate()
            : new Date(task.dueDate);
        let derivedStatus = task.status; // Default to the original status

        if (dueDate) {
          if (dueDate < currentDate) {
            derivedStatus = "Overdue";
          } else if (dueDate - currentDate <= 24 * 60 * 60 * 1000) {
            // 24 hours in milliseconds
            derivedStatus = "Urgent";
          }
        }

        statusCounts.Total++;

        if (derivedStatus in statusCounts) {
          statusCounts[derivedStatus]++;
        }
      });
    });
  }

  const progressData = statusOptions.map((option) => ({
    ...option,
    percent: (statusCounts[option.value] / statusCounts.Total) * 100,
  }));

  return (
    <div>
      <h1>Welcome, {currentUser.displayName}</h1>
      <Card>
        <h3>Task Status</h3>
        <Row gutter={16}>
          <Col span={4}>
            <Statistic title="Total" value={statusCounts.Total} />
          </Col>
          <Col span={24}>
            <Progress
              percent={100}
              showInfo={false}
              strokeColor={{
                "0%": progressData[0]?.color,
                "25%": progressData[1]?.color,
                "50%": progressData[2]?.color,
                "75%": progressData[3]?.color,
              }}
              success={{ percent: progressData[0]?.percent }}
              format={() => `${statusCounts.Total}`}
              style={{ marginBottom: "16px" }}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          {statusOptions.map((option) => (
            <Col key={option.value} span={6}>
              <Statistic
                title={<Badge color={option.color} text={option.value} />}
                value={statusCounts[option.value]}
              />
            </Col>
          ))}
        </Row>
      </Card>
      <Divider />
      <Card style={{ marginTop: "24px" }}>
        <h3>Announcements</h3>
        {announcements.map((announcement) => (
          <div key={announcement.id} style={{ marginBottom: "16px" }}>
            <p>
              <strong>{announcement.user}</strong>{" "}
              <span>{announcement.date}</span>
            </p>
            <p>{announcement.message}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}

export default HomeContentTeam;
