"use server";

import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  databases,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Convert gender to lowercase to match Appwrite's expected format
    const patientData = {
      ...patient,
      gender: patient.gender.toLowerCase(),
    };

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      patientData
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return patients.documents.length > 0
      ? parseStringify(patients.documents[0])
      : null;
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
    return null;
  }
};

// UPDATE PATIENT
export const updatePatient = async (
  patientId: string,
  patientData: Partial<RegisterUserParams>
) => {
  try {
    // Convert gender to lowercase if it exists
    const dataToUpdate = {
      ...patientData,
      ...(patientData.gender && { gender: patientData.gender.toLowerCase() }),
    };

    // Remove identificationDocument from the update data as it's handled separately
    const { identificationDocument, ...updateData } = dataToUpdate;

    // Update patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#updateDocument
    const updatedPatient = await databases.updateDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      patientId,
      updateData
    );

    return parseStringify(updatedPatient);
  } catch (error) {
    console.error("An error occurred while updating the patient:", error);
    throw error;
  }
};
