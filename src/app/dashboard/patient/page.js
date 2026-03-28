const PatientDashboard =async ({ searchParams }) => {
  const search = await searchParams;
  const showRoleWarning = search?.alert === "wrong_portal";
  return (
    <div>
      {showRoleWarning && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3 shadow-sm">
          <span className="text-yellow-800 font-medium">
            Note: You logged in through the Doctor portal, but you are
            registered as a Patient. We have safely redirected you to your
            Patient Dashboard.
          </span>
        </div>
      )}
      patientDashboard
    </div>
  );
};

export default PatientDashboard;
