"use client";

import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { uncachedFetchCommittees } from "@/app/actions/fetch";
import { db } from "@/app/lib/db";
import { CommitteeConstant } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";

import styles from "../../admin.module.css";

type CommitteeStateKey = keyof CommitteeConstant;
type FieldType = "text" | "long";

async function saveCommittee(committee: CommitteeConstant) {
  const docRef = doc(db, "constants", "committees");
  await setDoc(docRef, { [committee.id]: committee }, { merge: true });
}

export default function CommitteeEditor({}) {
  const [loadingState, setLoadingState] = useState("loading");
  const [saveState, setSaveState] = useState("idle");
  const [COMMITTEES, setCommittees] = useState<Record<
    string,
    CommitteeConstant
  > | null>(null);

  const [activeCommitteeId, setActiveCommitteeId] = useState<string>("");
  const [committeeDetails, setCommitteeDetails] =
    useState<CommitteeConstant | null>(null);

  useEffect(() => {
    (async () => {
      const data = await uncachedFetchCommittees();
      if (isError(data)) {
        setLoadingState("error");
      } else {
        setCommittees(data as Record<string, CommitteeConstant>);
        setLoadingState("loaded");
      }
    })();
  }, []);

  if (loadingState === "loading") {
    return <div>Loading...</div>;
  } else if (loadingState === "error") {
    return <div>Something went wrong when fetching committees.</div>;
  }

  const committeeKeys = Object.keys(
    COMMITTEES as Record<string, CommitteeConstant>,
  ).sort();

  const renderField = (
    label: string,
    stateKey: CommitteeStateKey,
    type: FieldType,
    options: {} = {},
  ) => {
    if (!committeeDetails) {
      return null;
    }
    const fieldAttrs = {
      ...options,
      id: stateKey,
      value: committeeDetails[stateKey] as string,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setCommitteeDetails({
          ...committeeDetails,
          [stateKey]: e.target.value,
        });
      },
    };

    return (
      <div className={styles.editorInputGroup}>
        <label htmlFor={stateKey}>{label}</label>
        {type === "text" && (
          <input type="text" className={styles.editorInput} {...fieldAttrs} />
        )}
        {type === "long" && (
          <textarea
            className={styles.editorTextArea}
            rows={6}
            {...fieldAttrs}
          />
        )}
      </div>
    );
  };

  const save = () => {
    if (
      !committeeDetails ||
      ["id", "name"].some((k) => !committeeDetails[k as CommitteeStateKey]) ||
      saveState === "pending"
    ) {
      return;
    }
    setSaveState("pending");
    try {
      saveCommittee(committeeDetails);
      setSaveState("success");
    } catch (err) {
      setSaveState("error");
    }
  };

  const renderEditor = () => {
    if (!activeCommitteeId) {
      return null;
    }
    const activeCommittee = (COMMITTEES as Record<string, CommitteeConstant>)[
      activeCommitteeId
    ];
    return (
      <>
        {renderField("Name", "name", "text")}
        {renderField("ID", "id", "text")}
        {renderField("Description", "description", "long")}
        <button onClick={save} disabled={saveState === "pending"}>
          Save
        </button>
      </>
    );
  };

  return (
    <>
      <h1>Editor</h1>
      <section className={styles.editorCard}>
        <select
          className={styles.editorSelect}
          onChange={(e) => {
            setActiveCommitteeId(e.target.value);
            if (e.target.value === "__new") {
              setCommitteeDetails({
                id: "",
                name: "",
                description: "",
              });
            } else if (e.target.value !== "") {
              setCommitteeDetails(
                JSON.parse(
                  JSON.stringify(
                    (COMMITTEES as Record<string, CommitteeConstant>)[
                      e.target.value
                    ],
                  ),
                ),
              );
            } else {
              setCommitteeDetails(null);
            }
          }}
          value={activeCommitteeId}
        >
          <option value="">Select a committee</option>
          <option value="__new">New committee</option>
          {committeeKeys.map((key) => (
            <option key={key} value={key}>
              {(COMMITTEES as Record<string, CommitteeConstant>)[key].name}
            </option>
          ))}
        </select>
        {renderEditor()}
      </section>
    </>
  );
}
