import Input from "../../shared/Forms/Input";
import Select from "../../shared/Forms/Select";

const NewSupplierProfileForm = ({ supplierCategory, formik }) => {
  return (
    <>
      <Input title="Name" formik={formik} fieldName="name" value={formik.values.name} placeHolder="Input Name" />
      <Input title="Email" formik={formik} fieldName="email" value={formik.values.email} placeHolder="Input Email" />
      <Input
        title="Phone Number"
        keyboardType="numeric"
        formik={formik}
        fieldName="phone"
        value={formik.values.phone}
        placeHolder="Input Phone Number"
      />
      <Select
        title="Supplier Category"
        placeHolder="Select Category"
        items={supplierCategory}
        formik={formik}
        value={formik.values.supplier_category_id}
        fieldName="supplier_category_id"
        onChange={(value) => formik.setFieldValue("supplier_category_id", value)}
      />
    </>
  );
};

export default NewSupplierProfileForm;
