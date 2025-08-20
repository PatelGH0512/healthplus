"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import { Doctors, GenderOptions } from "@/constants";
import { updatePatient } from "@/lib/actions/patient.actions";
import { PatientFormValidation } from "@/lib/validation";
import { Patient } from "@/types/appwrite.types";

import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

interface ProfileFormProps {
  patient: Patient;
}

const ProfileForm = ({ patient }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      birthDate: new Date(patient.birthDate),
      gender: (patient.gender.charAt(0).toUpperCase() +
        patient.gender.slice(1)) as Gender,
      address: patient.address,
      occupation: patient.occupation,
      emergencyContactName: patient.emergencyContactName,
      emergencyContactNumber: patient.emergencyContactNumber,
      primaryPhysician: patient.primaryPhysician,
      insuranceProvider: patient.insuranceProvider,
      insurancePolicyNumber: patient.insurancePolicyNumber,
      allergies: patient.allergies || "",
      currentMedication: patient.currentMedication || "",
      familyMedicalHistory: patient.familyMedicalHistory || "",
      pastMedicalHistory: patient.pastMedicalHistory || "",
      identificationType: patient.identificationType || "Birth Certificate",
      identificationNumber: patient.identificationNumber || "",
      identificationDocument: [],
      treatmentConsent: true,
      disclosureConsent: true,
      privacyConsent: patient.privacyConsent,
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const updateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        privacyConsent: values.privacyConsent,
      };

      await updatePatient(patient.$id, updateData);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSuccessMessage("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-dark-100 rounded-lg border bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-dark-900 text-2xl font-bold">
            Profile Information
          </h2>
          <p className="mt-1 text-dark-700">
            Your personal and medical details
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-primary hover:bg-primary/90 rounded-lg px-4 py-2 text-white transition-colors"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {successMessage && (
        <div
          className={`mb-6 rounded-lg p-4 ${
            successMessage.includes("successfully")
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {successMessage}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <section className="space-y-6">
            <div className="mb-6">
              <h3 className="text-dark-900 mb-2 text-lg font-semibold">
                Personal Information
              </h3>
            </div>

            {/* NAME */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="name"
              placeholder="John Doe"
              iconSrc="/assets/icons/user.svg"
              iconAlt="user"
              disabled={!isEditing}
            />

            {/* EMAIL & PHONE */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email address"
                placeholder="johndoe@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
                disabled={!isEditing}
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                label="Phone Number"
                placeholder="(555) 123-4567"
                disabled={!isEditing}
              />
            </div>

            {/* BirthDate & Gender */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Date of birth"
                disabled={!isEditing}
              />

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gender"
                disabled={!isEditing}
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!isEditing}
                    >
                      {GenderOptions.map((option, i) => (
                        <div key={option + i} className="radio-group">
                          <RadioGroupItem
                            value={option}
                            id={option}
                            disabled={!isEditing}
                          />
                          <Label
                            htmlFor={option}
                            className={`cursor-pointer ${!isEditing ? "text-dark-500" : ""}`}
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>

            {/* Address & Occupation */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                label="Address"
                placeholder="14 street, New york, NY - 5101"
                disabled={!isEditing}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Software Engineer"
                disabled={!isEditing}
              />
            </div>

            {/* Emergency Contact Name & Emergency Contact Number */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                label="Emergency contact name"
                placeholder="Guardian's name"
                disabled={!isEditing}
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                label="Emergency contact number"
                placeholder="(555) 123-4567"
                disabled={!isEditing}
              />
            </div>
          </section>

          <section className="space-y-6">
            <div className="mb-6">
              <h3 className="text-dark-900 mb-2 text-lg font-semibold">
                Medical Information
              </h3>
            </div>

            {/* PRIMARY CARE PHYSICIAN */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Primary care physician"
              placeholder="Select a physician"
              disabled={!isEditing}
            >
              {Doctors.map((doctor, i) => (
                <SelectItem key={doctor.name + i} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt="doctor"
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            {/* INSURANCE & POLICY NUMBER */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                label="Insurance provider"
                placeholder="BlueCross BlueShield"
                disabled={!isEditing}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                label="Insurance policy number"
                placeholder="ABC123456789"
                disabled={!isEditing}
              />
            </div>

            {/* ALLERGY & CURRENT MEDICATIONS */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="allergies"
                label="Allergies (if any)"
                placeholder="Peanuts, Penicillin, Pollen"
                disabled={!isEditing}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedication"
                label="Current medications"
                placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
                disabled={!isEditing}
              />
            </div>

            {/* FAMILY MEDICATION & PAST MEDICATIONS */}
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                label="Family medical history (if relevant)"
                placeholder="Mother had brain cancer, Father has hypertension"
                disabled={!isEditing}
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                label="Past medical history"
                placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
                disabled={!isEditing}
              />
            </div>
          </section>

          {isEditing && (
            <SubmitButton isLoading={isLoading}>Update Profile</SubmitButton>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
