import logo from './logo.svg';
import { useState, useEffect} from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

function App() {
  web3.eth.getAccounts().then(console.log);

  const [manager, setManager] = useState('');
  const [player, setPlayer] = useState([]);
  const [balance, setBalance] = useState('');
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('')
  

  useEffect(() => {
    async function fetchData() {
    const manager = await lottery.methods.manager().call();
    const player = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    setManager(manager)
    setPlayer(player)
    setBalance(balance)
    console.log(player + "test")
    }
    fetchData()
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const accounts = await  web3.eth.getAccounts();

      setMessage('Waiting on transaction success...');

      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      });

      setMessage('You have been entered!')
    } catch (error) {
      setMessage('Transaction error')
      console.log(error)
    }
  };

  const handleClick = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage('Waiting on transaction succes...')

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    setMessage('A winner has been picked!')
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p> 
        This contract is managed by {manager}. 
        There are currently {player.length}, people entered competing to win {web3.utils.fromWei(balance, 'ether')} ether !
      </p>
      <hr />

      <form onSubmit={handleSubmit}>
        <h4>Want to try your luck ?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
          value={value}
          onChange={event => setValue(event.target.value)} />
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h1> {message} </h1>

      <hr />

      <h4> Ready to pick a winner ?</h4>
      <button onClick={handleClick}>Pick a winner!</button>
    </div>
  );
}

export default App;
