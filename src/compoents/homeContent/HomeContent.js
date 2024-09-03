import React, { useEffect } from "react";
import { useApp } from "../../contexts/AppContext";
import { notification } from "antd";
import Loader from "../loader/Loader";
import Avatar from "../../assets/Avatar.png";

function HomeContent() {
  const {
    fetchClientPayments,
    fetchUniversities,
    fetchClients,
    fetchTeam,
    state,
    setLoading,
    fetchWeeks,
    fetchTasks,
    fetchAllTasksExceptLatest,
  } = useApp();

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

  return (
    <div>
      {state.loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="font-medium text-3xl text-start">Welcome, Shreya</div>
          <div className="flex flex-col gap-3">
            <div className="font-medium text-xl text-slate-500 text-start ">
              Task Status
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex bg-white items-center">
                <div className="flex flex-col gap-2 p-6">
                  <div className="font-normal text-xs">Total</div>
                  <div className="font-medium text-4xl">30</div>
                </div>
                <div className="w-full">progress bar</div>
              </div>
              <div className="flex gap-[10px]">
                <div className="flex flex-col gap-2 p-6 w-full bg-white">
                  <div className="flex items-center gap-[7px]">
                    <span className="h-[10px] w-[10px] rounded-full bg-green-500"></span>
                    <div className="font-normal text-[16px] text-slate-500">
                      Completed
                    </div>
                  </div>
                  <div className="font-medium text-4xl text-start">12</div>
                </div>
                <div className="flex flex-col gap-2 p-6 w-full bg-white">
                  <div className="flex items-center gap-[7px]">
                    <span className="h-[10px] w-[10px] rounded-full bg-[#FADB14]"></span>
                    <div className="font-normal text-[16px] text-slate-500">
                      Pending
                    </div>
                  </div>
                  <div className="font-medium text-4xl text-start">12</div>
                </div>
                <div className="flex flex-col gap-2 p-6 w-full bg-white">
                  <div className="flex items-center gap-[7px]">
                    <span className="h-[10px] w-[10px] rounded-full bg-[#FF4D4F]"></span>
                    <div className="font-normal text-[16px] text-slate-500">
                      Urgent
                    </div>
                  </div>
                  <div className="font-medium text-4xl text-start">12</div>
                </div>
                <div className="flex flex-col gap-2 p-6 w-full bg-white">
                  <div className="flex items-center gap-[7px]">
                    <span className="h-[10px] w-[10px] rounded-full bg-[#722ED1]"></span>
                    <div className="font-normal text-[16px] text-slate-500">
                      Overdue
                    </div>
                  </div>
                  <div className="font-medium text-4xl text-start">12</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="font-medium text-xl text-slate-500 text-start ">
              Announcements
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="flex flex-col gap-2 p-3 bg-white justify-start">
                <div className="flex gap-[10px]">
                  <img src={Avatar} ></img>
                  <div className="font-medium text-[16px] flex gap-[10px]">
                    <span className="font-normal text-[14px] text-slate-500">Danny George</span>
                    <span className="font-normal text-[14px] text-slate-500">20/07/2024, 08:19 PM</span>
                  </div>
                </div>
                <div className="font-normal text-[16px] text-start">
                  Happy Birthday Rohith !
                </div>
              </div>
              <div className="flex flex-col gap-2 p-3 bg-white justify-start">
                <div className="flex gap-[10px]">
                  <img src={Avatar} ></img>
                  <div className="font-medium text-[16px] flex gap-[10px]">
                    <span className="font-normal text-[14px] text-slate-500">Danny George</span>
                    <span className="font-normal text-[14px] text-slate-500">20/07/2024, 08:19 PM</span>
                  </div>
                </div>
                <div className="font-normal text-[16px] text-start">
                  Happy Birthday Rohith !
                </div>
              </div>
              <div className="flex flex-col gap-2 p-3 bg-white justify-start">
                <div className="flex gap-[10px]">
                  <img src={Avatar} ></img>
                  <div className="font-medium text-[16px] flex gap-[10px]">
                    <span className="font-normal text-[14px] text-slate-500">Danny George</span>
                    <span className="font-normal text-[14px] text-slate-500">20/07/2024, 08:19 PM</span>
                  </div>
                </div>
                <div className="font-normal text-[16px] text-start">
                  Happy Birthday Rohith !
                </div>
              </div>
              <div className="flex flex-col gap-2 p-3 bg-white justify-start">
                <div className="flex gap-[10px]">
                  <img src={Avatar} ></img>
                  <div className="font-medium text-[16px] flex gap-[10px]">
                    <span className="font-normal text-[14px] text-slate-500">Danny George</span>
                    <span className="font-normal text-[14px] text-slate-500">20/07/2024, 08:19 PM</span>
                  </div>
                </div>
                <div className="font-normal text-[16px] text-start">
                  Happy Birthday Rohith !
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeContent;
