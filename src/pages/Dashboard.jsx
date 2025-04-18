import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/common/Sidebar'

export const Dashboard = () => {
    const { loading: profileLoading } = useSelector((state) => state.profile)
    const { loading: authLoading } = useSelector((state) => state.auth)

    if (profileLoading || authLoading) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner">Loading...</div>
          </div>
        )
    }
  
    return (
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
          <Sidebar className="w-1/4" /> {/* Example fixed width for sidebar */}
          <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto bg-white-300">
            <div className="w-full p-8"> {/* Full width with padding */}
              <Outlet />
            </div>
          </div>
        </div>
    )
}



