import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_KEY
);

const authContainer = document.getElementById("auth-container");
const mainContent = document.getElementById("main-content");
const logoutButton = document.getElementById("logout-button");

// Function to show the authentication form
function showAuthForm() {
	const authForm = document.getElementById("auth-form");
	authForm.addEventListener("submit", handleLogin);
}

// Function to handle login
async function handleLogin(event) {
	event.preventDefault();
	const emailInput = document.getElementById("email-input");
	const submitButton = document.getElementById("submit-button");

	const email = emailInput.value;

	// Show loading state
	submitButton.disabled = true;
	submitButton.textContent = "Loading...";

	const { error } = await supabase.auth.signInWithOtp({ email });

	if (error) {
		alert(error.error_description || error.message);
	} else {
		alert("Check your email for the login link!");
	}

	// Reset button state
	submitButton.disabled = false;
	submitButton.textContent = "Send magic link";
}

// Function to handle logout
async function handleLogout() {
	const { error } = await supabase.auth.signOut();
	if (error) {
		alert("Error logging out: " + error.message);
	} else {
		checkSession();
	}
}

// Function to check the user's session
async function checkSession() {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (session) {
		// User is logged in
		authContainer.style.display = "none";
		mainContent.style.display = "block";
	} else {
		// User is logged out
		mainContent.style.display = "none";
		authContainer.style.display = "block";
		showAuthForm();
	}
}

// Listen for auth state changes
supabase.auth.onAuthStateChange(() => {
	checkSession();
});

// Initialize the app
checkSession();

// Attach logout functionality
logoutButton.addEventListener("click", handleLogout);
