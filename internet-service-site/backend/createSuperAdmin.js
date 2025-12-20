import readline from "readline";
import { supabase } from "./utils/supabaseClient.js"; // adjust path if needed

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function main() {
  try {
    console.log("--- Super Admin Creation ---");

    const email = await question("Enter Super Admin Email: ");
    const password = await question("Enter Password: ");

    if (!email || !password) {
      console.log("Email and password are required.");
      rl.close();
      return;
    }

    // 1️⃣ Create user in Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error("Auth creation failed:", authError.message);
      rl.close();
      return;
    }

    const superAdminId = authData?.user?.id;
    if (!superAdminId) {
      console.error("Failed to get Super Admin ID");
      rl.close();
      return;
    }

    // 2️⃣ Insert into profiles table
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: superAdminId,
        name: "Super Admin",
        email,
        role: "super-admin",
        image: "https://via.placeholder.com/150",
      },
    ]);

    if (insertError) {
      console.error("Profile insert failed:", insertError.message);
      rl.close();
      return;
    }

    console.log("✅ Super Admin created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    rl.close();
  }
}

main();
