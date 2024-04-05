import Input from "../../shared/Forms/Input";

const NewCustomerAddressForm = ({ formik }) => {
  return (
    <>
      <Input
        title="Address"
        multiline={true}
        formik={formik}
        fieldName="address"
        value={formik.values.address}
        placeHolder="Input Address"
      />
      <Input
        title="ZIP Code"
        keyboardType="numeric"
        formik={formik}
        fieldName="zip_code"
        value={formik.values.zip_code}
        placeHolder="Input ZIP Code"
      />
    </>
  );
};

export default NewCustomerAddressForm;
