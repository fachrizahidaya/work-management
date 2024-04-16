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
      <Input
        title="Bank Account"
        formik={formik}
        fieldName="bank_account"
        value={formik.values.bank_account}
        placeHolder="Input Bank Account"
      />
      <Input
        title="Account Number"
        keyboardType="numeric"
        formik={formik}
        fieldName="account_no"
        value={formik.values.account_no}
        placeHolder="Input Account Number"
      />
      <Input
        title="Account Name"
        formik={formik}
        fieldName="account_name"
        value={formik.values.account_name}
        placeHolder="Input Account Name"
      />
      <Input
        title="Comment"
        multiline={true}
        formik={formik}
        fieldName="comment"
        value={formik.values.comment}
        placeHolder="Input Comment"
      />
    </>
  );
};

export default NewSupplierProfileForm;
