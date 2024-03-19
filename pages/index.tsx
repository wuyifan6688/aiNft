import React from 'react';

interface AppProps {}
const App:React.FC<AppProps>=props => {
  const {}=props
  console.log(process.env.HUGGINGFACE_KEY)

  return <div></div>
}
export default App;