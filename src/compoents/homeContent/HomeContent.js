import React, { useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import { notification } from 'antd';
import Loader from '../loader/Loader';


function HomeContent() {
  const { fetchClientPayments, fetchUniversities, fetchClients, fetchTeam, state, setLoading, fetchWeeks, fetchTasks, fetchAllTasksExceptLatest } = useApp();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchUniversities(),
          fetchTeam(),
          fetchClients(),
          fetchWeeks(),
          fetchClientPayments(),
        ]);
        setLoading(false);

      } catch (error) {
        setLoading(false);
        notification.error({ message: 'Error fetching data', description: error.message });
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
          notification.error({ message: 'Error fetching tasks', description: error.message });
        }
      }
    };

    fetchTaskData();
  }, [state.activeSheet]);



  return (
    <div>
      {state.loading && <Loader />}
      <h2>Welcome, Admin</h2>
      HomeContent
    </div>
  )
}

export default HomeContent