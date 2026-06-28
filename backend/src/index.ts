import {
  createNewUser,
  deleteUserByEmail,
  deleteUserByUid,
  listUsers,
} from "./services/user_services.js";

// createNewUser({ name: "iqra", email: "iqra@miraj.co", password: "iqra123" });

async function main() {
  console.log("List of Users before deletion");
  await listUsers();
  console.log("\n\n");
  await deleteUserByEmail("iqra@miraj.co");
  console.log("\n\n");
  console.log("List of Users after deletion");
  await listUsers();
}

main();
