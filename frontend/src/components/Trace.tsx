function Trace() {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-foreground text-background max-w-sm w-1/3">
      <div className="flex flex-col justify-center text-center">
        <h2 className="text-lg font-bold mb-2 text-secondary">Trace Name</h2>
        <p className="text-sm text-secondary">Created At: 2024-12-22</p>
        <p className="text-sm text-secondary">Last Updated: 2024-12-23</p>
        <p className="text-sm text-secondary">Steps: 5</p>
        <p className="text-sm text-secondary mb-3">Organization: TraceAI Inc</p>
      </div>
      <div className="flex gap-2 justify-center">
        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg">
          Edit
        </button>
        <button className="bg-green-500 text-white px-3 py-1 rounded-lg">
          View
        </button>
        <button className="bg-red-500 text-white px-3 py-1 rounded-lg">
          Delete
        </button>
      </div>
    </div>
  );
}

export default Trace;
