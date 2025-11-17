export default function ProjectCard({ project }) {
  return (
    <div className="project-card bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-yellow-400 transition">
      <img src={project.logo} alt={project.name} className="h-16 w-16 object-cover rounded-full mb-2" />
      <h3 className="text-white font-bold text-lg">{project.name}</h3>
      <p className="text-neutral-400 text-sm mb-2">{project.symbol}</p>
      <p className="text-neutral-300 text-xs mb-2">{project.description}</p>
      <a href={`/project/${project._id}`} className="text-yellow-400 hover:underline">View Details</a>
    </div>
  );
}
