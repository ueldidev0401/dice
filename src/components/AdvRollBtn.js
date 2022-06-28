const AdvRollBtn = (props) => {
  const { label, onRoll, notation } = props;

  const roll = () => {
    onRoll(notation);
  };

  return <button onClick={roll}>{label}</button>;
};

export default AdvRollBtn;
