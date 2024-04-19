// Add a click event listener to the "submitPins" button
document.getElementById('submitPins').addEventListener('click', function () {
    submitPinsToSupabase();
});

function submitPinsToSupabase () {
    // Prompt the user to enter a name
    const name = prompt("Please enter a name for your map data:");

    if (name) {
        // Save pins data to Supabase table
        const mapUsed = state.currentMap.name;
        const mapData = state.userMapData;

        // Use the existing supabase client from data.js
        supabase.from("MapDataPublic").insert([{ mapUsed, name, mapData }])
            .then(response => {
                console.log("Pins data saved to MapDataPublic table in Supabase:", response);
                document.getElementById('namatamaText').innerHTML = "Thanks! Your pins have been submitted. They better be good!";
            })
            .catch(error => {
                console.error("Error saving pins data to Supabase:", error);
            });
    } else {
        console.log("Name not provided. Data submission cancelled.");
    }
}