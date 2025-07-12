import Query from "../models/Query.js";

export const submitQuery = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create new query
    const query = new Query({
      name,
      email,
      subject,
      message,
    });

    // Save query
    await query.save();

    res.status(201).json({
      success: true,
      message: "Query submitted successfully",
      query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error submitting query",
      error: error.message,
    });
  }
};

export const getQueries = async (req, res) => {
  try {
    const queries = await Query.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      queries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching queries",
      error: error.message,
    });
  }
};

export const updateQueryStatus = async (req, res) => {
  try {
    const { queryId } = req.params;
    const { status } = req.body;

    const query = await Query.findByIdAndUpdate(
      queryId,
      { status },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Query status updated successfully",
      query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating query status",
      error: error.message,
    });
  }
};
