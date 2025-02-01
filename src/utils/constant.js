export const ROLE = {
    ADMIN: "Admin",
    SALES:"Sales",
    STOCK:"Stock",
    MARKETING:"Marketing",
    OTHER:"Other"
}

export const sidebarData = [
    {
        title:"Dashboard",
        sections:[
            {name:"Dashboard", path:"dashboard/view"}
        ]
    },
    {
      title: "Sales",
      sections: [
        { name: "New Enquiry", path: "sales/new-enquiry" },
        { name: "Manage Enquiry", path: "sales/manage-enquiry" },
        { name: "New Dispatch", path: "sales/new-invoice" },
        { name: "Manage Dispatch", path: "sales/manage-invoice" },
        { name: "Quotation", path: "sales/quotation" },
        { name: "Manage Quotation", path: "sales/manage-quotation" },
      ],
    },
    {
      title: "Stock",
      sections: [
        { name: "Add Warehouse", path: "stock/add-warehouse" },
        { name: "Manage Warehouse", path: "stock/manage-warehouse" },
        { name: "Add New Product", path: "stock/add-product" },
        { name: "Manage Product", path: "stock/manage-product" },
        { name: "Category", path: "stock/category" },
        { name: "Manage Category", path: "stock/manage-category" },
      ],
    },
    {
      title: "CRM",
      sections: [
        { name: "Add Client", path: "crm/add-client" },
        { name: "Manage Client", path: "crm/manage-client" },
      ],
    },
    {
      title: "Supplier",
      sections: [
        { name: "New Supplier", path: "supplier/new-supplier" },
        { name: "Manage Supplier", path: "supplier/manage-supplier" },
        { name: "New Order", path: "supplier/new-order" },
        { name: "Manage Order", path: "supplier/manage-order" },
      ],
    },
    {
      title: "Accounts",
      sections: [
        { name: "Accounts", path: "accounts/accounts" },
        { name: "Manage Accounts", path: "accounts/manage-accounts" },
        { name: "Transaction", path: "accounts/transaction" },
        { name: "Manage Transaction", path: "accounts/manage-transaction" },
      ],
    },
   
    {
      title: 'Term', // Add the Term section
      sections: [
        { name: 'Create Term', path: '/term/create' },

      ]
    },
    {
      title: 'Marketing', // Add the Term section
      sections: [
        { name: 'View Quotations', path: '/marketing/quotation' },

      ]
    },
    {
      title:"Settings",
      sections:[
          {name:"Setting", path:"settings/setting"}
      ]
  },
  ];
  

