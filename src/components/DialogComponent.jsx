import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { InputSwitch } from "primereact/inputswitch";

export const DialogComponent = ({
  type,
  isDialogVisible,
  setIsDialogVisible,
  isLeadDialogDisabled,
  setIsLeadDialogDisabled,
  header,
  inputs,
  dialogInputObject,
  setDialogInputObject,
  handleAdd,
  handleEdit,
  formatCalendarDate,
  formatCalendarTime,
  isUserIDDropdown,
  setSelectedUser
}) => {
  const handleDialogInputChange = (field, value) => {
    setDialogInputObject((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    console.log(field, value);
  };

  return (
    <Dialog
      header={header}
      visible={isDialogVisible}
      resizable={false}
      draggable={false}
      onHide={() => {
        setIsDialogVisible(false);
        setDialogInputObject({});
      }}
      className={`w-full ${
        !type.includes("lead") ? "max-w-25rem" : ""
      } min-w-25rem`}
      style={{ maxWidth: "700px" }}
      content={({ hide }) => (
        <>
          <div className="p-dialog-header">
            <div className="p-dialog-title">{header}</div>
            <div className="p-dialog-header-icons flex gap-3">
              {type === "lead" ? (
                <Button
                  icon={isLeadDialogDisabled ? "pi pi-pencil" : "pi pi-check"}
                  text
                  severity="success"
                  onClick={() => {
                    setIsLeadDialogDisabled((prevState) => !prevState);
                  }}
                />
              ) : (
                ""
              )}
              <Button
                icon="pi pi-times"
                text
                severity="success"
                onClick={(e) => hide(e)}
              />
            </div>
          </div>

          <div
            className={`${
              type.includes("lead")
                ? "p-dialog-content w-full flex flex-wrap gap-3 justify-content-center"
                : "p-dialog-content flex flex-column gap-4 "
            }`}
          >
            {inputs.map((input, index) => {
              return (
                <div
                  className="w-full flex flex-column gap-2"
                  key={index}
                  style={
                    type.includes("lead")
                      ? { maxWidth: "calc(50% - 0.5rem)" }
                      : {}
                  }
                >
                  <h4 className="m-0">{input.label}</h4>
                  {input.type === "text" ? (
                    <InputText
                      value={dialogInputObject[input.key]}
                      onChange={(e) =>
                        handleDialogInputChange(input.key, e.target.value)
                      }
                      style={{ width: "100%" }}
                      placeholder={input.placeholder}
                      disabled={isLeadDialogDisabled || input.disabled}
                    />
                  ) : input.type === "dropdown" ? (
                    <Dropdown
                      value={dialogInputObject[input.key]}
                      onChange={(e) => {
                        isUserIDDropdown
                          ? setSelectedUser(e.value)
                          : handleDialogInputChange(input.key, e.target.value);
                      }}
                      options={input.options}
                      {...(isUserIDDropdown ? { optionLabel: "name" } : {})}
                      placeholder={input.placeholder}
                      className="w-full"
                      disabled={isLeadDialogDisabled}
                    />
                  ) : input.type === "calendar" ? (
                    <Calendar
                      value={
                        input.key === "offer_start" || input.key === "offer_end"
                          ? formatCalendarTime(
                              dialogInputObject[input.key],
                              "to Date"
                            )
                          : formatCalendarDate(
                              dialogInputObject[input.key],
                              "to Date"
                            )
                      }
                      onChange={(e) => {
                        console.log(e.value);
                        input.key === "offer_start" || input.key === "offer_end"
                          ? handleDialogInputChange(
                              input.key,
                              formatCalendarTime(e.value, "to string")
                            )
                          : handleDialogInputChange(
                              input.key,
                              formatCalendarDate(e.value, "to string")
                            );
                      }}
                      {...(input.key === "offer_start" ||
                      input.key === "offer_end"
                        ? { timeOnly: true }
                        : { dateFormat: "dd-mm-yy" })}
                      placeholder={input.placeholder}
                      disabled={isLeadDialogDisabled}
                    />
                  ) : input.type === "multiselect" ? (
                    <MultiSelect
                      value={dialogInputObject[input.key]}
                      onChange={(e) => {
                        handleDialogInputChange(input.key, e.value);
                      }}
                      options={input.options}
                      filter
                      maxSelectedLabels={3}
                      className="w-full"
                      placeholder={input.placeholder}
                    />
                  ) : input.type === "switch" ? (
                    <InputSwitch
                      checked={Boolean(dialogInputObject[input.key])}
                      onChange={(e) => {
                        handleDialogInputChange(input.key, e.value);
                      }}
                    />
                  ) : (
                    <span>Другой тип input</span>
                  )}
                </div>
              );
            })}
            <div className="flex">
              <Button
                label={
                  type.includes("add")
                    ? "Добавить"
                    : type === "edit" ||
                      (type === "lead" && !isLeadDialogDisabled)
                    ? "Редактировать"
                    : "Отправить"
                }
                onClick={() =>
                  type.includes("add") || type.includes("lead")
                    ? handleAdd(dialogInputObject)
                    : handleEdit(dialogInputObject)
                }
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    ></Dialog>
  );
};
