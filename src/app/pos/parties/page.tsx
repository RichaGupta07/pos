/* eslint-disable react/jsx-key */
"use client";
import CardPrototype from "@/app/Components/CardPrototype";
import List from "@/app/Components/List";
import Table from "@/app/Components/Table";
import TextInput from "@/app/Components/Textinput";
import React, { useEffect, useState } from "react";
import Partiescard from "./component/partiescard";
import { MdGroupAdd, MdOutlineEmail } from "react-icons/md";
import { IoPersonOutline, IoPersonSharp, IoSettings } from "react-icons/io5";
import { RiDropboxFill, RiPagesLine } from "react-icons/ri";
import { IoMdCard } from "react-icons/io";
import { PiMapPinBold } from "react-icons/pi";
import Modal from "@/app/Components/Modal";
import Button from "@/app/Components/Button";
import Tabs from "@/app/Components/Tabs";
import { TbCategory } from "react-icons/tb";
import Gstaddress from "./component/Gst&address";
import Creditbalance from "./component/Creditbalance";
import Additionalfield from "./component/Additionalfield";
import Table2 from "@/app/Components/Table2";
import { ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import pos_controller from "@/controller/posauth";
import { useSession } from "next-auth/react";
// import { PiMapPinAreaBold } from "react-icons/pi";

const validationSchema = Yup.object({
  partyName: Yup.string().required("Party Name is required"),
  GSTIN: Yup.string().required("GSTIN is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .matches(/^[0-9]{10}$/, "Phone Number must be exactly 10 digits"),
});

export default function Page() {
  const auth = new pos_controller();
  const session = useSession();
  const token = session?.data?.user?.image;
  const userid = (session as any)?.data?.id;
  const [selectedtab, setSelectedtab] = useState<any>();
  const [partyTransaction, setPartyTrasaction] = useState([]);
  console.log("selectedtab", selectedtab);
  const [modalopen, setModalopen] = useState(false);
  const [gstvalues, setGstvalues] = useState<any>();
  const [creditvalues, setCreditvalues] = useState<any>();
  const [partydata, setPartydata] = useState([]);
  const [open, setOpen]= useState(false)
  const [particularParty, setParticularParty] = useState<any>();
   useEffect(() => {
    auth
      .getpartyTransaction(token, selectedtab)
      .then((res) => {
        setPartyTrasaction(res);
        console.log("-->>>", res);
      })
      .catch((err) => {
        console.log(">>>>", err);
      });
  }, [token, selectedtab]);

  const headerData = ["Type", "Number", "Date", "Total", "Balance", " "];

  const bodyData = partyTransaction.map((item: any) => {
    return {
      value1: item?.type,
      value2: item?.number,
      value3: item?.date,
      value4: item?.total,
      value5: item?.balance,
    };
  });

  const heading = [
    {
      icon: <RiDropboxFill size={25} />,
      title: "GST & Address",
    },
    {
      icon: <IoSettings size={25} />,
      title: "Credit & Balance",
    },
    {
      icon: <TbCategory size={25} />,
      title: "Additional Fields",
    },
  ];

  const onPageChange = (page: any) => {
    // Your page change logic here
  };
  const firmid = localStorage.getItem("selectedStore");
  const submitForm = async (
    values: any,
    { setFieldError, setSubmitting, resetForm }: any
  ) => {
    console.log(values , "values");
    
    // const value = {
    //   partyName: values.partyName,
    //   gstNumber: values.GSTIN,
    //   phoneNum: values.phoneNumber,
    //   gstType: gstvalues?.Gsttype,
    //   state: gstvalues?.State,
    //   email: gstvalues?.email,
    //   billingAddress: gstvalues?.Billingaddress,
    //   shippingAddress: gstvalues?.Shippingaddress || undefined,
    //   openingBalance: creditvalues?.openingbalance,
    //   asOfDate: creditvalues?.date,
    //   creditLimit: creditvalues?.CreditLimit || undefined,
    //   user: {
    //     id: userid,
    //   },
    // };
    // try {
    //   setSubmitting(true);
    //   auth
    //     .AddfirmParty(value, token, firmid)
    //     .then((res) => {})
    //     .catch((err) => {
    //       console.log(err);
    //     });
    //     setOpen(true)
    //   resetForm();
    //   setModalopen(false);
    // } catch (err) {
    //   console.log("Error:", err);
    // } finally {
    //   setSubmitting(false);
    // }
  };

  useEffect(() => {
    auth
      .Getparty(token, firmid)
      .then((res: any) => {
        setPartydata(res.data?.data);
        console.log(res, "dffs");
      })
      .catch((err) => console.log(err));
  }, [token, firmid, open]);

  useEffect(() => {
    auth
      .GetpartiesbyID(token, selectedtab)
      .then((res: any) => {
        setParticularParty(res?.data?.data);
        console.log(">>>>>>>>>>partiesp", res);
      })
      .catch((err) => console.log(err));
  }, [token, selectedtab]);

  const count = bodyData.length; // Assuming count is based on bodyData length
  const isFullScreen = true;
  const content = [
    <Gstaddress Gstaddressvalues={setGstvalues} />,
    <Creditbalance creditbalancevalue={setCreditvalues} />,
    <Additionalfield />,
  ];


  useEffect(() => {
console.log(gstvalues , "gstvalues");

  }, [gstvalues])
  return (
    <>
      <div className="flex justify-between items-center px-1 mt-5">
        <div className="flex gap-3 w-[50%] items-center">
          <div className="w-[35%]">
            <TextInput
              name="search"
              type="text"
              placeholder="Search By"
              label=""
              istouched={"Touch"}
              className="text-gray-800 text-base w-full"
            />
          </div>
          <div
            className=" bg-[#fda80c] rounded-lg px-3 items-center mt-2 flex h-[45px]"
            title="Add Parties"
          >
            <MdGroupAdd
              color="white"
              size={25}
              onClick={() => setModalopen(!modalopen)}
            />
          </div>
        </div>
        <div className="flex gap-3 pr-7">
          <Button color={"bg-blue-500"} title={"Add Sale"} link={"/addsale"} />
          <Button
            color={"bg-orange-500"}
            title={"Add Purchase"}
            link={"/addpurchase"}
          />
          <Button color={"bg-gray-400"} title={"Add More"} link={"/"} />
        </div>
      </div>
      <div className="flex  mt-5 gap-5 mr-5">
        <div className="w-[26%] rounded-lg overflow-hidden ">
          <div className="bg-white  border border-gray-200 rounded-2xl shadow-sm w-full h-full overflow-x-hidden">
            <div className="bg-gray-100 px-4 py-4 text-[16px] flex justify-between">
              <div>Party</div>
              <div>Amount</div>
            </div>
            <List
              listdata={partydata}
              onselected={(id: number) => {
                setSelectedtab(id);
              }}
            />
          </div>
        </div>
        <div className="w-[74%] flex-col gap-5">
          <div>
            <CardPrototype>
              <div className="flex flex-wrap  ">
                <Partiescard
                  icon={<IoPersonOutline />}
                  title={"Name"}
                  value={
                    particularParty?.partyName
                      ? particularParty?.partyName
                      : "NA"
                  }
                />
                <Partiescard
                  icon={<RiPagesLine />}
                  title={"GSTIN"}
                  value={
                    particularParty?.gstNumber
                      ? particularParty?.gstNumber
                      : "NA"
                  }
                />
                <Partiescard
                  icon={<IoMdCard />}
                  title={"No Credit Limit set"}
                  value={
                    particularParty?.creditLimit
                      ? particularParty?.creditLimit
                      : "NA"
                  }
                />
                <Partiescard
                  icon={<PiMapPinBold />}
                  title={"Address"}
                  value={
                    particularParty?.billingAddress
                      ? particularParty?.billingAddress
                      : "NA"
                  }
                />
                <Partiescard
                  icon={<MdOutlineEmail />}
                  title={"Email"}
                  value={particularParty?.email ? particularParty?.email : "NA"}
                />
              </div>
            </CardPrototype>
          </div>

          <div className="flex justify-between w-full items-center px-3 my-3">
            <div className="text-[25px]">Transaction</div>
            <div className="w-[300px]">
              <TextInput
                name="search"
                type="text"
                placeholder="Search By"
                label=""
                istouched={"Touch"}
                className="text-gray-800 text-base w-full"
              />
            </div>
          </div>

          <div>
            <Table2
              headerData={headerData}
              bodyData={bodyData}
              onPageChange={onPageChange}
              count={count}
              isFullScreen={isFullScreen}
            />
            {/* <Table headerData={header} bodyData={dummyData} /> */}
          </div>
        </div>
      </div>
      <Modal isOpen={modalopen} onClose={() => setModalopen(false)}>
        <>
          <Formik
            initialValues={{
              partyName: "",
              GSTIN: "",
              phoneNumber: "",
            }}
            validationSchema={validationSchema}
            // onSubmit={submitForm}
            onSubmit={(values, { setSubmitting }) => {
                     console.log(values , "values");
                     
            }}        
          >
            {({
              isSubmitting,
              handleChange,
              values,
             }) => (
              <>
                <div className="flex justify-between mt-5 pb-3 border-b border-groove">
                  <div className="">Add Parties</div>
                  <button
                  type="submit"
                    className="bg-[#fda80c] rounded-lg px-5 text-white py-2 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
                <div className="flex gap-5 my-5 w-full">
                  <div className="w-[33%]">
                    <TextInput
                      name="partyName"
                      type="text"
                      placeholder=""
                      label="Party Name"
                      istouched={"Touch"}
                      value={values.partyName}
                      onChange={handleChange("partyName")}
                      onBlur={handleChange("partyName")}
                      className="text-gray-800 text-base w-[30%]"
                    />
                    <ErrorMessage
                      name="partyName"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="w-[33%]">
                    <TextInput
                      name="GSTIN"
                      type="text"
                      placeholder=""
                      label="GSTIN"
                      istouched={"Touch"}
                      value={values.GSTIN}
                      onChange={handleChange("GSTIN")}
                      onBlur={handleChange("GSTIN")}
                      className="text-gray-800 text-base w-[30%]"
                    />
                    <ErrorMessage
                      name="GSTIN"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="w-[33%]">
                    <TextInput
                      name="phoneNumber"
                      type="tel"
                      placeholder=""
                      label="Phone Number"
                      value={values.phoneNumber}
                      onChange={handleChange("phoneNumber")}
                      onBlur={handleChange("phoneNumber")}
                      istouched={"Touch"}
                      className="text-gray-800 text-base w-[30%]"
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </Formik>
          <Tabs heading={heading} content={content} />
        </>
      </Modal>
    </>
  );
}
