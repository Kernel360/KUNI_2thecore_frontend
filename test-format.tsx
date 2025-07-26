import React from 'react';

const TestComponent = ({ name, age }: { name: string; age: number }) => {
  return (
    <div>
      <h1>Hello {name}</h1>
      <p>You are {age} years old</p>
    </div>
  );
};

export default TestComponent;
