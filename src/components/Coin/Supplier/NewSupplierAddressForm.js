import Input from "../../shared/Forms/Input";

const NewSupplierAddressForm = ({ formik }) => {
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
      <Input title="City" formik={formik} fieldName="city" value={formik.values.city} placeHolder="Input City" />
      <Input
        title="Province"
        formik={formik}
        fieldName="province"
        value={formik.values.province}
        placeHolder="Input Province"
      />
      <Input title="State" formik={formik} fieldName="state" value={formik.values.state} placeHolder="Input State" />
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

export default NewSupplierAddressForm;
