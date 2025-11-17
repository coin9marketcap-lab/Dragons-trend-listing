'use client';

export default function ProjectCard({ project }) {
  return (
    <div className={`p-4 rounded-lg flex items-center justify-between 
      ${project.premium ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white'} `}>
      <div className="flex items-center space-x-4">
        <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-full" />
        <div>
          <p className="font-bold">{project.name}</p>
          <p className="text-sm">{project.symbol}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {project.premium && <span>👑</span>}
        <p>{project.votes}</p>
      </div>
    </div>
  );
}
