// Add a click event listener to the "submitPins" button
document.getElementById('submitPins').addEventListener('click', function() {
    submitPinsToSupabase();
});

function submitPinsToSupabase() {
    // Assuming 'pins' is a global array containing all the pins
    console.log("All Pins:");
    console.log(pins);

    // Save pins data to Supabase table
    const mapUsed = currentMap;
    const name = "community";
    const mapData = pins;

    // Use the existing supabase client from data.js
    supabase.from("MapDataPublic").insert([{ mapUsed, name, mapData }])
        .then(response => {
            console.log("Pins data saved to MapDataPublic table in Supabase:", response);
            document.getElementById('namatamaText').innerHTML = "Thanks! Your pins have been submitted. They better be good!";
        })
        .catch(error => {
            console.error("Error saving pins data to Supabase:", error);
        });
}