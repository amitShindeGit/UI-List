import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import React from "react";
import db from "../FIrebase/Firebase";
import classes from "../Styles/Item.module.css";

const Item = ({ id, index, text, lastItem, firstItem }) => {
  const dbRef = collection(db, "List");

  const onUpClickHandler = async (currId, currIndex) => {
    const q = query(
      dbRef,
      where("index", "<", currIndex),
      orderBy("index", "desc"),
      limit(1)
    ); //< and desc for immediate up, inc for immediate down
    let updateItemId = "";
    let updateItemIndex;

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (it) => {
      updateItemId = it.id;
      updateItemIndex = it.data().index;
    });

    //BATCH
    const batch = writeBatch(db);
    const currItemRef = doc(db, "List", currId);
    batch.update(currItemRef, { index: updateItemIndex });

    const updateItem = doc(db, "List", updateItemId); //check for existence updateItemId
    batch.update(updateItem, { index: currIndex });

    await batch.commit();
  };

  const onDownClickHandler = async (currId, currIndex) => {
    const q = query(
      dbRef,
      where("index", ">", currIndex),
      orderBy("index"),
      limit(1)
    ); //< and desc for immediate up, inc for immediate down
    let updateItemId = "";
    let updateItemIndex;

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (it) => {
      updateItemId = it.id;
      updateItemIndex = it.data().index;
    });

    //BATCH
    const batch = writeBatch(db);
    const currItemRef = doc(db, "List", currId);
    batch.update(currItemRef, { index: updateItemIndex });

    const updateItem = doc(db, "List", updateItemId); //check for existence updateItemId
    batch.update(updateItem, { index: currIndex });

    await batch.commit();
  };

  const onDeletHandler = async(currId) => {
    await deleteDoc(doc(db, "List", currId));
  }

  return (
    <div className={classes.itemMainDIv}>
      <div className={classes.leftDiv}>
        <p>{text}</p>
      </div>

      <div className={classes.rightDiv}>
        <div className={classes.rightFirstDiv}>
          {/* do styling instead */}
          <button
            disabled={firstItem === 0 ? true : false}
            className={classes.arrowBtn}
            onClick={() => onUpClickHandler(id, index)}
          >
            <i
              className="fas fa-solid fa-arrow-up"
              style={{
                display: "inline",
                color: `${firstItem === 0 ? "grey" : "#4711DE"}`,
                cursor: `${firstItem === 0 ? "not-allowed" : "pointer"}`,
              }}
            ></i>
          </button>

          <button
            disabled={lastItem ? true : false}
            className={classes.arrowBtn}
            onClick={() => onDownClickHandler(id, index)}
          >
            <i
              className="fas fa-solid fa-arrow-down"
              style={{
                display: "inline",
                color: `${lastItem ? "grey" : "#4711DE"}`,
                cursor: `${lastItem ? "not-allowed" : "pointer"}`,
              }}
            ></i>
          </button>
        </div>

        <div>
          <p onClick={() => onDeletHandler(id)} className={classes.deleteIcn}>
            x
          </p>
        </div>
      </div>
    </div>
  );
};

export default Item;
