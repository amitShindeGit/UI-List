import React, { useEffect, useState } from "react";

import ItemList from "./Components/ItemList";
import TextAdder from "./Components/TextAdder";

function App() {
  return (
    <div>
      <ItemList />
      <TextAdder />
    </div>
  );
}

export default App;
