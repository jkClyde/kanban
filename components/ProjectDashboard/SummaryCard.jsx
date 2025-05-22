import Link from "next/link";

export default function SummaryCards({
  totalProjects,
  completedProjects,
  totalTasks,
  services,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] md:gap-6 mb-7">
      {/* Total Projects Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
          <span className="bg-blue_bg text-blue-100 text-xs font-medium rounded-[5px] px-2.5 py-1">All</span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mt-2">{totalProjects}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <span className="text-green_bg font-medium">{completedProjects} completed</span>
          <span className="mx-2">•</span>
          <span className="text-yellow_bg font-medium">{totalProjects - completedProjects} ongoing</span>
        </div>
      </div>
      
      {/* Services Offered */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-500 text-sm font-medium">Total Services</h3>
          <span className="bg-green_bg text-red-100 text-xs font-medium rounded-[5px] px-2.5 py-1">Tags</span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {services.length}
        </p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <Link href="#">
            <button className="text-green_bg font-medium hover:underline focus:outline-none">
              View all services
            </button>
          </Link>
        </div>
      </div>

       {/* Total Tasks Card */}
       <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-gray-500 text-sm font-medium">My Ongoing Tasks</h3>
          <span className="bg-pink_bg text-red-100 text-xs font-medium rounded-[5px] px-2.5 py-1">Tasks</span>
        </div>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {/* {completedTasks} / {totalTasks} */}
          {totalTasks}
        </p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <Link href="/tasks">
            <button className="text-green_bg font-medium hover:underline focus:outline-none">
              View Your Tasks
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}