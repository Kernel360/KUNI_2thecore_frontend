import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="mx-auto flex flex-col justify-center items-center w-full">
      <div
        style={{
          backgroundColor: '#f6f6f6',
          padding: '0px 10px 100px 10px',
          marginTop: '3px',
          width: '100%',
          height: '100%',
          maxWidth: '1290px',
          maxHeight: '2000px',
          borderRadius: '10px',
        }}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default App