import "./styles.css";
import DisplayResults from "@3d-dice/dice-ui/src/displayResults"; // fui index exports are messed up -> going to src
import DiceParser from "@3d-dice/dice-parser-interface";
import { Dice } from "./components/diceBox";
import AdvRollBtn from "./components/AdvRollBtn";

// create Dice Roll Parser to handle complex notations
const DRP = new DiceParser();

// create display overlay for final results
const DiceResults = new DisplayResults("#dice-box");

// initialize the Dice Box outside of the component
Dice.init().then(() => {
  // clear dice on click anywhere on the screen
  document.addEventListener("mousedown", () => {
    const diceBoxCanvas = document.getElementById("dice-canvas");
    if (window.getComputedStyle(diceBoxCanvas).display !== "none") {
      Dice.hide().clear();
      DiceResults.clear();
    }
  });
});

export default function App() {
  // This method is triggered whenever dice are finished rolling
  Dice.onRollComplete = (results) => {
    console.log(results);

    // handle any rerolls
    const rerolls = DRP.handleRerolls(results);
    if (rerolls.length) {
      rerolls.forEach((roll) => Dice.add(roll, roll.groupId));
      return rerolls;
    }
    // if no rerolls needed then parse the final results
    const finalResults = DRP.parseFinalResults(results);

    // show the results
    DiceResults.showResults(finalResults);
  };

  // trigger dice roll
  const rollDice = (notation, group) => {
    // trigger the dice roll using the parser
    Dice.show().roll(DRP.parseNotation(notation));
  };

  return (
    <div className="App">
      <h1>Dice Rolling Demo</h1>
      <p>
        supports most notations seen at{" "}
        <a
          href="https://wiki.roll20.net/Dice_Reference#Roll20_Dice_Specification"
          target="_blank"
        >
          Roll20_Dice_Specification
        </a>
      </p>
      <div className="buttonList">
        <span className="header">Roll Action</span>
        <span className="header">Notation</span>
        <span className="header">Explaination</span>
        <AdvRollBtn
          label="d20 Advantage"
          notation="2d20kh1"
          onRoll={rollDice}
        />
        <span className="notation">'2d20kh1'</span>
        <span className="exp">Roll '2d20' keeping the highest of the two</span>

        <AdvRollBtn
          label="Attribute Roll"
          notation="4d6dl1"
          onRoll={rollDice}
        />
        <span className="notation">'4d6dl1'</span>
        <span className="exp">
          Roll '4d6' and drop the lowest result of the group. A common roll for
          attributes.
        </span>

        <AdvRollBtn label="Exploding Roll" notation="8d6!" onRoll={rollDice} />
        <span className="notation">'8d6!'</span>
        <span className="exp">
          Roll '8d6' and add a additional 'd6' roll for every die that results
          in 6
        </span>

        <AdvRollBtn
          label="Great Weapon Fighting"
          notation="2d10ro<2"
          onRoll={rollDice}
        />
        <span className="notation">'2d10ro&lt;2'</span>
        <span className="exp">
          Roll '2d10' and reroll only once results that are a 2 or 1.
        </span>

        <AdvRollBtn label="Target > 7" notation="10d10>7" onRoll={rollDice} />
        <span className="notation">'10d10&gt;7'</span>
        <span className="exp">
          Roll '10d10' and count up the number of rolls that are 7 or greater
        </span>

        <AdvRollBtn
          label="Colossus Slayer + Hunter's Mark"
          notation="1d8+1d8+1d6"
          onRoll={rollDice}
        />
        <span className="notation">'1d8+1d8+1d6'</span>
        <span className="exp">
          Roll '1d8' + '1d8' + '1d6' and add the results together
        </span>

        <AdvRollBtn
          label="Spot Check 60% - Normal"
          notation="1d100<60"
          onRoll={rollDice}
        />
        <span className="notation">'1d100&lt;60'</span>
        <span className="exp">
          Roll a '1d100' and note success if the result is less than 60
        </span>

        <AdvRollBtn
          label="Spot Check 60% - Hard"
          notation="1d100<(60/2)"
          onRoll={rollDice}
        />
        <span className="notation">'1d100&lt;(60/2)'</span>
        <span className="exp">
          Roll a '1d100' and note success if the result is less than 30
        </span>

        <AdvRollBtn
          label="Spot Check 60% - Extreme"
          notation="1d100<(60/5)"
          onRoll={rollDice}
        />
        <span className="notation">'1d100&lt;(60/5)'</span>
        <span className="exp">
          Roll a '1d100' and note success if the result is less than 12
        </span>
      </div>
    </div>
  );
}
