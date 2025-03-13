export const notifyProjectMembers = (req, project, eventType, todo) => {
  const io = req.app.get('io');
  const connectedUsers = req.app.get('connectedUsers');

  project.users.forEach((memberId) => {
    if (connectedUsers.has(memberId.toString())) {
      io.to(connectedUsers.get(memberId.toString())).emit(eventType, todo);
    }
  });
};
