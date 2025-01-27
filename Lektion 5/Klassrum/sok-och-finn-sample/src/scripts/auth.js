import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_KEY
);

const authContainer = document.getElementById("auth-container");
const mainContent = document.getElementById("main-content");
const logoutButton = document.getElementById("logout-button");
const authForm = document.getElementById("auth-form");

authForm.addEventListener("submit", handleLogin);

async function handleLogin(event) {
	event.preventDefault();
	const emailInput = document.getElementById("email-input");
	const submitButton = document.getElementById("submit-button");

	const email = emailInput.value;

	submitButton.disabled = true;
	submitButton.textContent = "Loading";

	const { error } = await supabase.auth.signInWithOtp({ email });

	if (error) {
		alert("Could not sign in: ", error);
	} else {
		alert("Logged in! Check your email");
	}
}

async function checkSession() {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	console.log("Session is: ", session);
	if (session) {
		authContainer.style.display = "none";
		mainContent.style.display = "block";
	} else {
		authContainer.style.display = "block";
		mainContent.style.display = "none";
	}
}

supabase.auth.onAuthStateChange(() => {
	checkSession();
});

checkSession();

logoutButton.addEventListener("click", handleLogout);

async function handleLogout() {
	const { error } = await supabase.auth.signOut();
	if (error) {
		alert("Error logging out: ", error);
	} else {
		checkSession();
	}
}
