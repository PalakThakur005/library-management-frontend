import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaBookOpen, FaArrowLeft, FaArrowRight , FaLayerGroup , FaCheckCircle , FaTimesCircle } from "react-icons/fa";
import  toast  from "react-hot-toast";
import api from "../../components/Api/Axios";
import MiniLoader from "../../components/CommonPages/Minloader";
import DashboardCard from "../../components/CommonPages/DashboardCard";
import CustomToolTip from "../../components/CommonPages/CustomToolTip";


function Books() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    quantity: "",
  });



  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [userID, setUserID] = useState("")
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
 const [search ,setSearch] = useState("")
  const isbnPattern = /^(\d{5}|\d{7})$/;

  
// card
     const [stats, setStats] = useState({
    totalBooks: 0,
    totalCopies: 0,
    availableBooks: 0,
     outOfStock: 0,
  });


  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const res = await api.get("/api/book/getstats");
      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // pagination

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  const PaginationRequest = async (pageNumber = 1) => {
    try {
      const response = await api.get(
        `/api/book/pagination?page=${pageNumber}&limit=${limit}&search=${search}`,
      );
      setBooks(response.data.data)
      getStats();
      setPage(response.data.page);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    PaginationRequest(page);
  }, [page ,search]);


  const handleBooks = () => {
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };


  const normalizeText = (text = "") =>
  text.toLowerCase().replace(/[-_\s]/g, "");

  const filteredBooks = books.filter((item) => {
  return (
    normalizeText(item.title).includes(normalizeText(search)) ||
    normalizeText(item.author).includes(normalizeText(search)) ||
    item.isbn.includes(search)
  );
});


  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    else if (
      books.some(
        (book) =>
          book.title.trim().toLowerCase() === formData.title.trim().toLowerCase() &&
          book.author.trim().toLowerCase() === formData.author.trim().toLowerCase() &&
          book._id !== editId
      )
    ) {
      newErrors.title = "This book already exists with the same author";
    }
    if (!formData.author.trim()) newErrors.author = "Author is required";

    if (!formData.isbn.trim()) {
      newErrors.isbn = "ISBN is required";
    } else if (!isbnPattern.test(formData.isbn)) {
      newErrors.isbn = "ISBN must be 5 or 7 digits";
    }
    // Fix duplicate check for edit
    else if (
      books.some(
        (book) =>
          book.isbn.trim() === formData.isbn.trim() &&
          book._id !== editId
      )
    ) {
      newErrors.isbn = "ISBN already exists";
    }

    if (!formData.category.trim()) newErrors.category = "Category is required";

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(
          `/api/book/update-book/${editId}`,
          formData
        );
        toast.success("Book updated successfully");
      } else {
        await api.post("/api/book/books", formData);
        toast.success("Book added successfully");
      }

      PaginationRequest(page);
      getStats();

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }

    // Reset everything
    setShowForm(false);
    setIsEdit(false);
    setEditId(null);
    

    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      quantity: "",
    });
  };


  //update

  const handleEdit = (book) => {
    setShowForm(true);
    setIsEdit(true);
    setEditId(book._id);

    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      quantity: book.quantity,
    });
  };

 




   




  return (
    <div className="bg-white min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 py-6">
          <div>
            <h1 className="font-[Poppins] text-[25px] font-bold italic">
              BOOKS <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">MANAGEMENT</span>
            </h1>
            <p className="text-sm font-semibold text-gray-500 pb-10">
             Add new books to your library and manage your collection efficiently.
</p>
          </div>

          <button
            onClick={handleBooks}
            className="w-auto cursor-pointer sm:w-auto self-start flex items-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition"
          >
            <FaBookOpen />
            Add Books
          </button>
        </div>

        <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">

  {/* Total Books */}
  <DashboardCard
    icon={<FaBookOpen />}
    title="Total Books"
    count={stats.totalBooks}
    color="#3b82f6"
    bgColor="bg-blue-50"
  />

  {/* Total Copies */}
  <DashboardCard
    icon={<FaLayerGroup />}
    title="Total Copies"
    count={stats.totalCopies}
    color="#10b981"
    bgColor="bg-green-50"
  />

  {/* Available Books */}
  <DashboardCard
    icon={<FaCheckCircle />}
    title="Available Books"
    count={stats.availableBooks}
    color="#22c55e"
    bgColor="bg-emerald-50"
  />

  {/* Out of Stock */}
  <DashboardCard
    icon={<FaTimesCircle />}
    title="Out of Stock"
    count={stats.outOfStock}
    color="#ef4444"
    bgColor="bg-red-50"
  />

</div>



{/* form */}

        {showForm && (
          <div className="fixed inset-0 bg-black/50   flex justify-center items-center z-50">
            <div className="bg-white w-[95%] sm:w-105 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-5 border-b pb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Book
                </h2>

                <button
                  onClick={() => {
                    setShowForm(false);
                     setIsEdit(false);   
                     setEditId(null); 
                    setFormData({
                      title: "",
                      author: "",
                      isbn: "",
                      category: "",
                      quantity: "",
                    });
                    setErrors({});
                  }}

                  className="text-gray-400 cursor-pointer hover:text-red-500 text-xl font-bold transition"
                >
                  &times;
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-3 ">

                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    Book Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    placeholder="Enter book title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.title && <p className="text-red-500 text-sm text-center">{errors.title}</p>}

                <div className="flex items-center gap-4">
                  <label className=" w-32 text-sm text-gray-600">Author</label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Enter author name"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.author && <p className="text-red-500 text-sm text-center">{errors.author}</p>}


                <div className="flex items-center gap-4">
                  <label className="w-32 text-sm text-gray-600">
                    ISBN Number
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    placeholder="ISBN Number"
                    title="ISBN must be 5 or 7 digits"
                    value={formData.isbn}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.isbn && <p className="text-red-500 text-sm text-center">{errors.isbn}</p>}

                <div className="flex items-center gap-4">
                  <label className=" w-32 text-sm text-gray-600">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Fiction, Tech"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.category && <p className="text-red-500 text-sm text-center">{errors.category}</p>}

                <div className="flex items-center gap-4">
                  <label className=" w-32 text-sm text-gray-600">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min={1}
                    max={50}
                    placeholder="Enter quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border-2 border-gray-200 rounded-lg bg-blue-50 outline-none focus:border focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                {errors.quantity && <p className="text-red-500 text-sm text-center">{errors.quantity}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                       setIsEdit(false);   
                        setEditId(null); 
                      setFormData({
                        title: "",
                        author: "",
                        isbn: "",
                        category: "",
                        quantity: "",
                      });
                      setErrors({});
                    }}


                    className="px-4 py-2  cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={loading}
                    type="submit"
                    className={`flex  cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm transition shadow
                  ${loading
                        ? "cursor-not-allowed bg-blue-400 opacity-80"
                        : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    {loading ? (
                      <>
                        <MiniLoader size="w-5 h-5" />
                        {isEdit ? "Updating..." : "Adding..."}
                      </>
                    ) : (
                      isEdit ? "Update Book" : "Add Book"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
        }


   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-12">

  <div className="flex items-center gap-4">

    <h1 className="font-[Poppins] text-[22px] sm:text-[26px] md:text-[28px] font-bold italic">
      Library{" "}
      <span className="bg-linear-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
        Books
      </span>
    </h1>

    <div className="h-0.5 w-16 sm:w-24 md:w-32 bg-linear-to-l from-transparent via-blue-400 to-blue-600 rounded-full animate-pulse"></div>
  </div>
  <div>
    <input
      type="text"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);}
      }
      placeholder="🔍 Search by title , isbn or author..."
            className="w-auto sm:w-56 md:w-64 px-3 py-2 text-sm outline-none border border-gray-400 rounded-lg focus:ring-1 focus:ring-blue-100 focus:border-blue-500 self-start"
    />
  </div>

</div>

        {/* table */}
        <div className="mt-10">
          

          <div className="w-full overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">

            <table className="min-w-175 w-full text-sm border-collapse">

              <thead className="bg-blue-600 text-white sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left font-semibold">Title</th>
                  <th className="p-4 text-left font-semibold">Author</th>
                  <th className="p-4 text-left font-semibold">ISBN</th>
                  <th className="p-4 text-left font-semibold">Category</th>
                  <th className="p-4 text-left font-semibold">Quantity</th>
                  <th className="p-4 text-left font-semibold">Action</th>
                </tr>
              </thead>
<tbody className="divide-y divide-gray-200">
  {books.length === 0 ? (
  <tr>
    <td colSpan="6" className="p-8">
      
      <div className="flex flex-col items-center justify-center text-center 
                      bg-white shadow-lg rounded-2xl py-3 px-6 border border-gray-100">

          <div className="bg-gray-200 p-4 rounded-full mb-3">
                <FaBookOpen className="text-3xl text-gray-400" />
              </div>
        <h2 className="text-xl font-semibold text-gray-700">
          No Books Available
        </h2>

        <p className="text-sm text-gray-400 mt-2">
          You haven’t added any books yet.
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Data will appear once books are added.
        </p>

        {/* Button (optional) */}
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white 
                     px-6 py-2.5 rounded-lg font-medium shadow-md 
                     hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
        >
           Add Book
        </button>

      </div>

    </td>
  </tr>

  ) : (
    books.map((item, index) => (
      <tr
        key={index}
        className="hover:bg-blue-50 transition duration-200"
      >
        <td className="p-4 text-start capitalize font-medium text-gray-900 whitespace-nowrap">
          {item.title}
        </td>

        <td className="p-4 text-start capitalize text-gray-700 whitespace-nowrap">
          {item.author}
        </td>

        <td className="p-4 text-start text-gray-700 break-all">
          {item.isbn}
        </td>

        <td className="p-4 text-start capitalize text-gray-700">
          {item.category}
        </td>

        <td className="p-4 text-start text-gray-900 font-semibold">
          {item.quantity}
        </td>

        <td className="p-3">
          <div className="flex justify-start gap-4 text-lg whitespace-nowrap">
            <CustomToolTip text="Edit Book">
            <FaEdit
              onClick={() => handleEdit(item)}
              className="text-gray-500 cursor-pointer hover:scale-110 hover:text-gray-600 transition"
            />
            </CustomToolTip>


          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </div>


       {totalPages > 1 && (
  <div className="flex justify-end items-center gap-3 mt-6 pb-6">

    <button
      disabled={page === 1}
      onClick={() => setPage(page - 1)}
      className="flex items-center gap-1 px-4 py-1.5 rounded-md border border-gray-300 text-gray-600
      bg-white hover:bg-gray-100 hover:text-[#00455c]
      active:scale-95 transition-all duration-200
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
    >
      <FaArrowLeft className="text-sm" />
      <span className="text-sm font-medium">Prev</span>
    </button>

    <span className="text-sm font-semibold text-gray-700 px-2">
      {page} <span className="text-gray-400">of</span> {totalPages}
    </span>

    <button
      disabled={page === totalPages}
      onClick={() => setPage(page + 1)}
      className="flex items-center gap-1 px-4 py-1.5 rounded-md border border-gray-300 text-gray-600
      bg-white hover:bg-gray-100 hover:text-[#00455c]
      active:scale-95 transition-all duration-200
      disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
    >
      <span className="text-sm font-medium">Next</span>
      <FaArrowRight className="text-sm" />
    </button>

  </div>
)}

      </div >
    </div >
  );
}

export default Books;
