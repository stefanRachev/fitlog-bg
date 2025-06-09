
import ReactModal from 'react-modal'; 
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; 



ReactModal.setAppElement('#root'); 

export default function ConfirmationDialog({
  isOpen,
  setIsOpen,
  title,
  message,
  onConfirm,
  confirmButtonText = "Потвърди",
  cancelButtonText = "Отказ",
  confirmButtonClass = "bg-red-600 hover:bg-red-700",
}) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)} 
      contentLabel={title} 
      className="relative transform overflow-hidden rounded-lg bg-white p-6 shadow-xl my-8 mx-auto max-w-lg w-full"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
    >
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className={`inline-flex w-full justify-center rounded-md ${confirmButtonClass} px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto`}
          onClick={() => {
            onConfirm();
            setIsOpen(false);
          }}
        >
          {confirmButtonText}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => setIsOpen(false)}
        >
          {cancelButtonText}
        </button>
      </div>
    </ReactModal>
  );
}