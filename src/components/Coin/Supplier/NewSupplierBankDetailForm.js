import Input from "../../shared/Forms/Input";
import Select from "../../shared/Forms/Select";

const NewSupplierBankDetailForm = ({ formik, bank }) => {
  return (
    <>
      {/* <Select
        title="Bank"
        placeHolder="Select Bank"
        items={bank}
        formik={formik}
        value={formik.values.bank_id}
        fieldName="bank_id"
        onChange={(value) => formik.setFieldValue("bank_id", value)}
      /> */}
      {/* <Input
        title="Account Number"
        keyboardType="numeric"
        formik={formik}
        fieldName="account_no"
        value={formik.values.account_no}
        placeHolder="Input Account Number"
      /> */}
      {/* <Input
        title="Account Name"
        formik={formik}
        fieldName="account_name"
        value={formik.values.account_name}
        placeHolder="Input Account Name"
      /> */}
    </>
  );
};

export default NewSupplierBankDetailForm;
