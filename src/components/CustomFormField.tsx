import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Control } from "react-hook-form";

import CustomDatePickerHeader from "./CustomDatePickerHeader";
import { Checkbox } from "./ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

export enum FormFieldType {
  INPUT = "input",
  NUMBER = "number",
  FILE = "file",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dateFormat?: string;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
  fileRef?: {
    name: string;
  };
  currentDate?: Date;
  required?: boolean;
}

const RenderInput = ({ field, props }: { field: any; props: CustomProps }) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="rounded-md">
          <FormControl>
            <Input
              type="text"
              disabled={props.disabled}
              placeholder={props.placeholder}
              {...field}
              className="shad-input "
            />
          </FormControl>
        </div>
      );
    case FormFieldType.NUMBER:
      return (
        <div className="rounded-md">
          <FormControl>
            <Input
              type={props.fieldType}
              disabled={props.disabled}
              placeholder={props.placeholder}
              onChange={(e) => field.onChange(Number(e.target.value))}
              className="shad-input "
            />
          </FormControl>
        </div>
      );
    case FormFieldType.FILE:
      return (
        <div className="rounded-md">
          <FormControl>
            <Input
              disabled={props.disabled}
              type={props.fieldType}
              placeholder={props.placeholder}
              {...props.fileRef}
              className="shad-input"
            />
          </FormControl>
        </div>
      );
    case FormFieldType.DATE_PICKER:
      return (
        <div className="border-border">
          <FormControl>
            <DatePicker
              autoComplete="off"
              disabled={props.disabled}
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              showMonthDropdown
              showYearDropdown
              dateFormat={"dd/MM/yyyy"}
              placeholderText="dd/MM/yyyy"
              wrapperClassName="date-picker"
              renderCustomHeader={({ date, changeYear, changeMonth }) => (
                <CustomDatePickerHeader
                  changeYear={changeYear}
                  changeMonth={changeMonth}
                  date={date}
                />
              )}
            />
          </FormControl>
        </div>
      );
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
          <div className="flex items-center gap-4">
            <Checkbox
              id={props.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <label htmlFor={props.name} className="checkbox-label">
              {props.label}
            </label>
          </div>
        </FormControl>
      );

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            disabled={props.disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="shad-select-trigger h-10 rounded-md">
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
    default:
      return null;
  }
};

const CustomFormField = (props: CustomProps) => {
  const { control, name, label, required = true } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label ">
              {required ? (
                <span>
                  {label} <span className="text-red-500">*</span>
                </span>
              ) : (
                <span>{label}</span>
              )}
            </FormLabel>
          )}
          <RenderInput field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
