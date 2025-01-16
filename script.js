const participantForm = document.getElementById("participantForm");
const mainBox = document.getElementById("mainbox")

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

participantForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = participantForm.name.value;
  const mobile = participantForm.mobile.value;
  const email = participantForm.email.value;

  try {
    const response = await fetch(
      "https://amira-lucky-spin-backend.onrender.com/api/participants",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, mobile, email }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message);
      return;
    }

    const data = await response.json();
    participantId = data.participantId; // Store the received participant ID

    participantForm.classList.add("hideForm");
    mainBox.classList.remove("hidebox");
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
});

function spin() {
  // Play the sound
  wheel.play();

  // Initialize variables
  const box = document.getElementById("box");
  const element = document.getElementById("mainbox");
  let SelectedItem = "";

  // Unique angles for each prize
  const ToteBag = shuffle([1890, 2250, 2610]);
  const BetterLuckNextTime = shuffle([1850, 2210, 2570, 2930, 3290, 3650])
  const noteBook =shuffle([2750, 3110, 3470, 3830, 4190, 4550]);
  const A10Off = shuffle([1810, 2170, 2530, 2890, 3250, 3610]);
  const a20perecentOff = shuffle([1770, 2130]);
  const A30Off = shuffle([3790, 4150]);
  const calender = shuffle([2830, 3190, 3550, 3910]);  

  // Create a results array without duplicating values
  const results = shuffle([
    ToteBag[0],
    BetterLuckNextTime[0],
    A10Off[0],
    a20perecentOff[0],
    calender[0],
    A30Off[0],
    noteBook[0]
  ]);

  console.log(results[0]); // Debug: Check the selected angle

  // Map the angle to the prize
  if (BetterLuckNextTime.includes(results[0])) SelectedItem = "Better Luck Next Time";
  else if (calender.includes(results[0])) SelectedItem = "Calender";
  else if (a20perecentOff.includes(results[0])) SelectedItem = "20% Off";
  else if (A10Off.includes(results[0])) SelectedItem = "10% Off";
  else if (A30Off.includes(results[0])) SelectedItem = "30% Off";
  else if (ToteBag.includes(results[0])) SelectedItem = "Tote Bag";
  else if (noteBook.includes(results[0])) SelectedItem = "Note Book";

  // Spin the wheel
  box.style.setProperty("transition", "all ease 5s");
  box.style.transform = "rotate(" + results[0] + "deg)";
  element.classList.remove("animate");
  setTimeout(function () {
    element.classList.add("animate");
  }, 5000);

  // Display popup alert
  setTimeout(async function () {
    applause.play();
    swal("Dear Customer", "You Won " + SelectedItem + ".", "success");

    const participantMobile = participantForm.mobile.value; // Get the participant's mobile number
    try {
      const response = await fetch(
        "https://amira-lucky-spin-backend.onrender.com/api/participants/add-answer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mobile: participantMobile,
            question: "Spin the Wheel",
            selectedOption: SelectedItem,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        alert("Failed to save your spin result. Please try again.");
        return;
      }

      console.log("Spin result saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while saving your spin result.");
    }

  }, 5500);

  // Reset wheel to initial state
  setTimeout(function () {
    box.style.setProperty("transition", "initial");
    box.style.transform = "rotate(90deg)";
  }, 6500);
}
