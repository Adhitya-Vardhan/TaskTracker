import React, { createContext, useReducer, useContext } from 'react';
import {
    addUniversity, fetchUniversities, fetchSubjects, addSubject, deleteUniversity,
    editUniversity, deleteSubject, editSubject, fetchTeam, suspendTeam, activateTeam, addTeamMember,
    editTeam, addClient, fetchClients, suspendClient, activateClient, transferDocument, editClient,
    addClientPayment, fetchClientPayments, deleteClientPayment, addTransactionId, addCoordinator,
    fetchClientsAndCoordinators, editCoordinator, suspendCoordinator, activateCoordinator, addSheet,
    fetchWeeks, addTask, fetchTasks, deleteTask, fetchAllTasksExceptLatest, updateGrade, addGrade,
    addProject, fetchExtraProjects, deleteExtraProject, editProject, updateProjectStatus, addProjectPayment,
    fetchProjectPayments, deleteProjectPayment, updateTasksStatus

} from '../firebase/actions';
import { type } from '@testing-library/user-event/dist/type';


const initialState = {
    loading: false,
    universities: [],
    subjects: [],
    teamMembers: [],
    clients: [],
    clientPayments: [],
    projectPayments: [],
    weeks: [],
    tasks: [],
    selectedWeekTasks: [],
    allTasks: {}, // Add this to store all tasks from all weeks
    activeSheet: "",
    extraProjects: [],
};

const AppContext = createContext(initialState);

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_UNIVERSITIES':
            return { ...state, universities: action.payload };
        case 'SET_SUBJECTS':
            return { ...state, subjects: action.payload };
        case 'SET_TEAMMEMBERS':
            return { ...state, teamMembers: action.payload };
        case 'SET_CLIENTS':
            return { ...state, clients: action.payload };
        case 'SET_WEEKS':
            return {
                ...state,
                weeks: action.payload,
                activeSheet: action.payload.length > 0 ? action.payload[0].id : null,
            };
        case 'SET_TASKS':
            return {
                ...state,
                tasks: action.payload,
            };
        case 'SET_ALL_TASKS':
            return {
                ...state,
                allTasks: action.payload
            }
        case 'SET_EXTRA_PROJECTS':
            return {
                ...state,
                extraProjects: action.payload,
            };
        case 'SET_PROJECT_PAYMENTS':
            return {
                ...state,
                projectPayments: action.payload
            };
        case 'ADD_UNIVERSITY':
            return {
                ...state,
                universities: [...state.universities, action.payload]
            };
        case 'DEL_UNIVERSITY':
            return { ...state, universities: state.universities.filter(univ => univ.id !== action.payload) };
        case 'EDIT_UNIVERSITY':
            return {
                ...state,
                universities: state.universities.map(univ =>
                    univ.id === action.payload.id ? { ...univ, ...action.payload.updatedData } : univ
                )
            };
        case 'ADD_SUBJECTS':
            return {
                ...state,
                subjects: [...state.subjects, action.payload]
            };
        case 'DEL_SUBJECT':
            return { ...state, subjects: state.subjects.filter(sub => sub.id !== action.payload) };
        case 'EDIT_SUBJECT':
            return {
                ...state,
                subjects: state.subjects.map(sub =>
                    sub.id === action.payload.id ? { ...sub, ...action.payload.updatedData } : sub
                )
            };
        case 'SUSPEND_TEAM_MEMBER':
            return {
                ...state,
                teamMembers: state.teamMembers.map(member =>
                    member.id === action.payload.id ? { ...member, suspend: true } : member
                ),
            };
        case 'ACTIVATE_TEAM_MEMBER':
            return {
                ...state,
                teamMembers: state.teamMembers.map(member =>
                    member.id === action.payload.id ? { ...member, suspend: false } : member
                ),
            };
        case 'ADD_TEAM':
            return {
                ...state,
                teamMembers: [...state.teamMembers, action.payload]
            };
        case 'EDIT_TEAM_MEMBER':
            return {
                ...state,
                teamMembers: state.teamMembers.map(member =>
                    member.id === action.payload.id ? { ...member, ...action.payload.updatedFields } : member
                ),
            };
        case 'ADD_CLIENT':
            return { ...state, clients: [...state.clients, action.payload] };
        case 'SUSPEND_CLIENT':
            return {
                ...state,
                clients: state.clients.map(client =>
                    client.id === action.payload ? { ...client, suspend: true } : client
                ),
            };
        case 'ACTIVATE_CLIENT':
            return {
                ...state,
                clients: state.clients.map(client =>
                    client.id === action.payload ? { ...client, suspend: false } : client
                ),
            };
        case 'REMOVE_CLIENT':
            return {
                ...state,
                clients: state.clients.filter(client => client.id !== action.payload)
            };
        case 'ADD_COMPLETED':
            return {
                ...state,
                completed: [...state.completed, action.payload]
            };
        case 'EDIT_CLIENT':
            return {
                ...state,
                clients: state.clients.map(client =>
                    client.id === action.payload.id ? { ...client, ...action.payload.updatedFields } : client
                ),
            };
        case 'ADD_CLIENT_PAYMENT':
            return {
                ...state,
                clientPayments: [action.payload, ...state.clientPayments]
            };
        case 'SET_PAYMENTS':
            return {
                ...state,
                clientPayments: action.payload
            };
        case 'DEL_CLIENT_PAYMENT':
            return { ...state, clientPayments: state.clientPayments.filter(pay => pay.id !== action.payload) };
        case 'DEL_PROJECT_PAYMENT':
            return {
                ...state,
                projectPayments: state.projectPayments.filter(pay => pay.id !== action.payload)
            };
        case 'UPDATE_PAYMENT':
            return {
                ...state,
                clientPayments: state.clientPayments.map(payment =>
                    payment.id === action.payload.id
                        ? { ...payment, ...action.payload.updatedData }
                        : payment
                )
            };
        case 'UPDATE_PROJECT_PAYMENT':
            return {
                ...state,
                projectPayments: state.projectPayments.map(project =>
                    project.id === action.payload.id
                        ? { ...project, ...action.payload.updatedData }
                        : project
                )
            };
        case 'ADD_COORDINATOR': {
            const clientIndex = state.clients.findIndex(client => client.id === action.payload.clientId);
            if (clientIndex === -1) return state; // Client not found, return the current state

            const updatedClients = [...state.clients];
            const updatedClient = {
                ...updatedClients[clientIndex],
                latestTimestamp: action.payload.coordinator.timestamp,
                coordinators: [action.payload.coordinator, ...(updatedClients[clientIndex].coordinators || [])]
            };
            updatedClients[clientIndex] = updatedClient;

            return {
                ...state,
                clients: updatedClients
            };
        }
        case 'EDIT_COORDINATOR': {
            const clientIndex = state.clients.findIndex(client => client.id === action.payload.clientId);
            if (clientIndex === -1) return state; // Client not found, return the current state

            const updatedClients = [...state.clients];
            const client = updatedClients[clientIndex];
            const coordinatorIndex = client.coordinators.findIndex(coordinator => coordinator.id === action.payload.data.id);
            if (coordinatorIndex === -1) return state; // Coordinator not found, return the current state

            // Update the status of the specific coordinator to 'complete'
            const updatedCoordinator = {
                ...client.coordinators[coordinatorIndex],
                status: 'complete'
            };

            // Update the client's coordinators array
            const updatedCoordinators = [...client.coordinators];
            updatedCoordinators[coordinatorIndex] = updatedCoordinator;

            // Update the client with the new coordinators array
            updatedClients[clientIndex] = {
                ...client,
                coordinators: updatedCoordinators
            };

            return {
                ...state,
                clients: updatedClients
            };
        }
        case 'SUSPEND_COORDINATOR': {
            console.log('this is the client that is being updated:', action.payload)
            const clientIndex = state.clients.findIndex(client => client.id === action.payload.clientId);
            if (clientIndex === -1) return state;

            const updatedClients = [...state.clients];
            const client = updatedClients[clientIndex];
            const coordinatorIndex = client.coordinators.findIndex(coordinator => coordinator.id === action.payload.data.id);
            if (coordinatorIndex === -1) return state; // Coordinator not found, return the current state

            // Update the status of the specific coordinator to 'complete'
            const updatedCoordinator = {
                ...client.coordinators[coordinatorIndex],
                suspend: true
            };

            // Update the client's coordinators array
            const updatedCoordinators = [...client.coordinators];
            updatedCoordinators[coordinatorIndex] = updatedCoordinator;

            // Update the client with the new coordinators array
            updatedClients[clientIndex] = {
                ...client,
                coordinators: updatedCoordinators
            };

            return {
                ...state,
                clients: updatedClients
            };
        }
        case 'ACTIVATE_COORDINATOR': {
            const clientIndex = state.clients.findIndex(client => client.id === action.payload.clientId);
            if (clientIndex === -1) return state; // Client not found, return the current state

            const updatedClients = [...state.clients];
            const client = updatedClients[clientIndex];
            const coordinatorIndex = client.coordinators.findIndex(coordinator => coordinator.id === action.payload.data.id);
            if (coordinatorIndex === -1) return state; // Coordinator not found, return the current state

            // Update the status of the specific coordinator to 'complete'
            const updatedCoordinator = {
                ...client.coordinators[coordinatorIndex],
                suspend: false
            };

            // Update the client's coordinators array
            const updatedCoordinators = [...client.coordinators];
            updatedCoordinators[coordinatorIndex] = updatedCoordinator;

            // Update the client with the new coordinators array
            updatedClients[clientIndex] = {
                ...client,
                coordinators: updatedCoordinators
            };

            return {
                ...state,
                clients: updatedClients
            };
        }
        case 'ADD_SHEET':
            return {
                ...state,
                weeks: [action.payload, ...state.weeks],
                activeSheet: action.payload.id,
            };
        case 'SET_ACTIVE_SHEET':
            const selectedWeekTasks = state.allTasks[action.payload] || [];
            return {
                ...state,
                activeSheet: action.payload,
                selectedWeekTasks,
            };
        case 'ADD_TASK':
            const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
            if (taskIndex !== -1) {//if the id is found then add to task array 
                const updatedTasks = state.tasks.map((task, index) => {
                    if (index === taskIndex) {
                        return {
                            ...task,
                            tasks: [action.payload.taskData, ...(task.tasks || [])]
                        };
                    }
                    return task;
                });

                return {
                    ...state,
                    tasks: updatedTasks
                };
            } else {
                // If the id is not present, add a new object with id, key, and tasks array containing taskData
                const newTask = {
                    id: action.payload.id,
                    key: action.payload.key,
                    tasks: [action.payload.taskData]
                };

                return {
                    ...state,
                    tasks: [newTask, ...state.tasks]
                };
            }
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.uniqueKey
                        ? { ...task, tasks: task.tasks.filter(t => t.taskName !== action.payload.task.taskName) }
                        : task
                )
            };
        case 'UPDATE_TASK_STATUS':
            return {
                ...state,
                tasks: state.tasks.map(task => {
                    if (task.id === action.payload.uniqueKey) {
                        return {
                            ...task,
                            tasks: task.tasks.map(t =>
                                t.taskName === action.payload.taskName
                                    ? { ...t, status: action.payload.newStatus }
                                    : t
                            )
                        };
                    }
                    return task;
                })
            };
        case 'UPDATE_GRADE':
            return (() => {
                const { updatedTasks, weekName, uniqueKey } = action.payload;

                // Clone the current state to avoid direct mutations
                const updatedAllTasks = { ...state.allTasks };
                let updatedTasksArray = state.tasks;

                // Access the week's tasks array and update the specific task object in allTasks
                if (updatedAllTasks[weekName]) {
                    const taskIndex = updatedAllTasks[weekName].findIndex(task => task.id === uniqueKey);

                    if (taskIndex !== -1) {
                        updatedAllTasks[weekName][taskIndex] = {
                            ...updatedAllTasks[weekName][taskIndex],
                            tasks: updatedTasks
                        };
                    }
                } else {
                    // If weekName does not exist in allTasks, perform the logic on state.tasks
                    updatedTasksArray = state.tasks.map(task =>
                        task.id === uniqueKey
                            ? { ...task, tasks: updatedTasks }
                            : task
                    );
                    console.log('this is the updated task array:', updatedTasksArray);
                }

                return {
                    ...state,
                    allTasks: updatedAllTasks,
                    tasks: updatedTasksArray
                };
            })();
        case 'ADD_GRADE': {
            const clientIndex = state.clients.findIndex(client => client.id === action.payload.uniqueKey);
            if (clientIndex === -1) return state; // Client not found, return the current state

            const updatedClients = [...state.clients];
            const client = updatedClients[clientIndex];
            const coordinatorIndex = client.coordinators.findIndex(coordinator => coordinator.id === action.payload.id);
            if (coordinatorIndex === -1) return state; // Coordinator not found, return the current state

            // Update the finalGrade of the specific coordinator
            const updatedCoordinator = {
                ...client.coordinators[coordinatorIndex],
                finalGrade: action.payload.finalGrade
            };

            // Update the client's coordinators array
            const updatedCoordinators = [...client.coordinators];
            updatedCoordinators[coordinatorIndex] = updatedCoordinator;

            // Update the client with the new coordinators array
            updatedClients[clientIndex] = {
                ...client,
                coordinators: updatedCoordinators
            };


            return {
                ...state,
                clients: updatedClients
            };
        }
        case 'ADD_PROJECT':
            return {
                ...state,
                extraProjects: [action.payload, ...state.extraProjects]
            };
        case 'DEL_EXTRA_PROJECT':
            return {
                ...state,
                extraProjects: state.extraProjects.filter(project => project.id !== action.payload)
            };
        case 'EDIT_EXTRA_PROJECT': {
            const projectIndex = state.extraProjects.findIndex(project => project.id === action.payload.id);

            if (projectIndex === -1) return state; // If the project is not found, return the current state

            // Clone the current state
            const updatedProjects = [...state.extraProjects];

            // Update the specific project
            updatedProjects[projectIndex] = {
                ...updatedProjects[projectIndex],
                ...action.payload.updatedFields,
            };

            return {
                ...state,
                extraProjects: updatedProjects,
            };
        }
        case 'PROJECT_STATUS': {
            const projectIndex = state.extraProjects.findIndex(project => project.id === action.payload.id);
            if (projectIndex === -1) return state
            const updatedProjects = [...state.extraProjects];
            updatedProjects[projectIndex] = {
                ...updatedProjects[projectIndex],
                status: action.payload.status,
            };
            return {
                ...state,
                extraProjects: updatedProjects,
            };
        }
        case 'ADD_PROJECT_PAYMENT':
            return {
                ...state,
                projectPayments: [action.payload, ...state.projectPayments]
            };

        default:
            return state;
    }
};

export const AppProvider = ({ children }) => { // Change Children to children
    const [state, dispatch] = useReducer(appReducer, initialState);


    const value = {
        state,
        dispatch,
        setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
        setActiveSheet: (id) => dispatch({ type: 'SET_ACTIVE_SHEET', payload: id }),
        fetchUniversities: () => fetchUniversities(dispatch),
        fetchSubjects: () => fetchSubjects(dispatch),
        fetchTeam: () => fetchTeam(dispatch),
        fetchClients: () => fetchClients(dispatch),
        fetchWeeks: () => fetchWeeks(dispatch),
        fetchClientPayments: () => fetchClientPayments(dispatch),
        fetchProjectPayments: () => fetchProjectPayments(dispatch),
        fetchClientsAndCoordinators: (clients) => fetchClientsAndCoordinators(dispatch, clients),
        fetchTasks: (activeSheet) => fetchTasks(dispatch, activeSheet),
        fetchAllTasksExceptLatest: (weeks, activeSheet) => fetchAllTasksExceptLatest(dispatch, weeks, activeSheet),
        fetchExtraProjects: () => fetchExtraProjects(dispatch),
        addUniversity: (university) => addUniversity(dispatch, university),
        deleteUniversity: (university) => deleteUniversity(dispatch, university),
        editUniversity: (id, updatedData) => editUniversity(dispatch, id, updatedData),
        addSubject: (subjectData) => addSubject(dispatch, subjectData),
        deleteSubject: (subject) => deleteSubject(dispatch, subject),
        editSubject: (id, updatedData) => editSubject(dispatch, id, updatedData),
        suspendTeam: (id) => suspendTeam(dispatch, id),
        activateTeam: (id) => activateTeam(dispatch, id),
        addTeamMember: (values) => addTeamMember(dispatch, values),
        editTeam: (id, updatedData) => editTeam(dispatch, id, updatedData),
        addClient: (clientdata) => addClient(dispatch, clientdata),
        suspendClient: (id) => suspendClient(dispatch, id),
        activateClient: (id) => activateClient(dispatch, id),
        transferDocument: (sourceCollection, docId, targetCollection) =>
            transferDocument(dispatch, sourceCollection, docId, targetCollection),
        editClient: (id, updatedData) => editClient(dispatch, id, updatedData),
        addClientPayment: (payment) => addClientPayment(dispatch, payment),
        deleteClientPayment: (payment) => deleteClientPayment(dispatch, payment),
        deleteProjectPayment: (payment) => deleteProjectPayment(dispatch, payment),
        addTransactionId: (id, type, transactionId) => addTransactionId(dispatch, id, type, transactionId),
        addCoordinator: (data) => addCoordinator(dispatch, data),
        editCoordinator: (id, data) => editCoordinator(dispatch, id, data),
        suspendCoordinator: (id, data) => suspendCoordinator(dispatch, id, data),
        activateCoordinator: (id, data) => activateCoordinator(dispatch, id, data),
        addSheet: (sheetName) => addSheet(dispatch, sheetName),
        addTask: (data) => addTask(dispatch, data),
        deleteTask: (task, uniqueKey, activeSheet) => deleteTask(dispatch, task, uniqueKey, activeSheet),
        updateTasksStatus: (sheet, task, uniqueKey, newStatus) => updateTasksStatus(dispatch, sheet, task, uniqueKey, newStatus),
        updateGrade: (updatedData) => updateGrade(dispatch, updatedData),
        addGrade: (updatedData) => addGrade(dispatch, updatedData),
        addProject: (data) => addProject(dispatch, data),
        deleteExtraProject: (id) => deleteExtraProject(dispatch, id),
        editProject: (id, updatedData) => editProject(dispatch, id, updatedData),
        updateProjectStatus: (id, value) => updateProjectStatus(dispatch, id, value),
        addProjectPayment: (payment) => addProjectPayment(dispatch, payment),
    };

    return (
        <AppContext.Provider value={value}>
            {children} {/* Change Children to children */}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
