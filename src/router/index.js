import Vue from "vue";
import Router from "vue-router";

import Dashboard from "@/components/Main/Dashboard/Dashboard";


//Accounts

import Expense from "@/components/Main/Accounts/Expense/Expense"
import ExpenseEdit from "@/components/Main/Accounts/Expense/ExpenseEdit"

import JournalEntry from "@/components/Main/Accounts/JournalEntry/JournalEntry"
import JournalEntryEdit from "@/components/Main/Accounts/JournalEntry/JournalEntryEdit"


//Inventory
import StockMovement from "@/components/Main/Inventory/StockMovement/StockMovement"
import StockMovementEdit from "@/components/Main/Inventory/StockMovement/StockMovementEdit"

import StockAdjustment from "@/components/Main/Inventory/StockAdjustment/StockAdjustment"
import StockAdjustmentEdit from "@/components/Main/Inventory/StockAdjustment/StockAdjustmentEdit"


//Module ------------------Sale-------------------------------------------Start

import PurchaseInvoice from "@/components/Main/Purchase/Invoice/Invoice"
import PurchaseInvoiceEdit from "@/components/Main/Purchase/Invoice/InvoiceEdit"

import PurchaseReturn from "@/components/Main/Purchase/Return/Return"
import PurchaseReturnEdit from "@/components/Main/Purchase/Return/ReturnEdit"

import PurchaseRefund from "@/components/Main/Purchase/Refund/Refund"
import PurchaseRefundEdit from "@/components/Main/Purchase/Refund/RefundEdit"


import MakePayment from "@/components/Main/Purchase/MakePayment/MakePayment"
import MakePaymentEdit from "@/components/Main/Purchase/MakePayment/MakePaymentEdit"


//Module ------------------Sale-------------------------------------------Start
import SaleQuotation from "@/components/Main/Sale/Quotation/Quotation"
import SaleOrder from "@/components/Main/Sale/Order/Order"

import Delivery from "@/components/Main/Sale/Delivery/Delivery"
import DeliveryEdit from "@/components/Main/Sale/Delivery/DeliveryEdit"

import Invoice from "@/components/Main/Sale/Invoice/Invoice"
import InvoiceEdit from "@/components/Main/Sale/Invoice/InvoiceEdit"

import Order from "@/components/Main/Sale/Order/Order"
import OrderEdit from "@/components/Main/Sale/Order/OrderEdit"

import Quotation from "@/components/Main/Sale/Quotation/Quotation"
import QuotationEdit from "@/components/Main/Sale/Quotation/QuotationEdit"

import SaleReceiveMoney from "@/components/Main/Sale/ReceiveMoney/ReceiveMoney"
import SaleReceiveMoneyEdit from "@/components/Main/Sale/ReceiveMoney/ReceiveMoneyEdit"

import RecurringInvoice from "@/components/Main/Sale/RecurringInvoice/RecurringInvoice"
import RecurringInvoiceEdit from "@/components/Main/Sale/RecurringInvoice/RecurringInvoiceEdit"

import Refund from "@/components/Main/Sale/Refund/Refund"
import RefundEdit from "@/components/Main/Sale/Refund/RefundEdit"

import Return from "@/components/Main/Sale/Return/Return"
import ReturnEdit from "@/components/Main/Sale/Return/ReturnEdit"

import Settlement from "@/components/Main/Sale/Settlement/Settlement"
import SettlementEdit from "@/components/Main/Sale/Settlement/SettlementEdit"
//Module ------------------Sale-------------------------------------------End

////////////////////////////////////////Setup/////////////////////////////////////////////////
//List
import Customers from "@/components/Main/Setup/List/Customers/Customers"
import CustomersEdit from "@/components/Main/Setup/List/Customers/CustomersEdit"
import Employees from "@/components/Main/Setup/List/Employees/Employees"
import EmployeesEdit from "@/components/Main/Setup/List/Employees/EmployeesEdit"
import Products from "@/components/Main/Setup/List/Products/Products"
import ProductsEdit from "@/components/Main/Setup/List/Products/ProductsEdit"
import SalesPerson from "@/components/Main/Setup/List/SalesPerson/SalesPerson"
import SalesPersonEdit from "@/components/Main/Setup/List/SalesPerson/SalesPersonEdit" 
import Vendors from "@/components/Main/Setup/List/Vendors/Vendors"
import VendorsEdit from "@/components/Main/Setup/List/Vendors/VendorsEdit"
//Categories
import CategoryBrand from "@/components/Main/Setup/Categories/Brands/Brands"
import BrandsEdit from "@/components/Main/Setup/Categories/Brands/BrandsEdit"
import CategoryCustomer from "@/components/Main/Setup/Categories/CustomerCategories/CustomerCategories"
import CustomerCategoriesEdit from "@/components/Main/Setup/Categories/CustomerCategories/CustomerCategoriesEdit"
import CategoryDepartment from "@/components/Main/Setup/Categories/Departments/Departments"
import DepartmentsEdit from "@/components/Main/Setup/Categories/Departments/DepartmentsEdit"
import CategoryDesignation from "@/components/Main/Setup/Categories/Designation/Designation"
import DesignationEdit from "@/components/Main/Setup/Categories/Designation/DesignationEdit"
import CategoryProduct from "@/components/Main/Setup/Categories/ProductCategories/ProductCategories"
import ProductCategoriesEdit from "@/components/Main/Setup/Categories/ProductCategories/ProductCategoriesEdit"
import CategoryVendor from "@/components/Main/Setup/Categories/VendorCategories/VendorCategories"
import VendorCategoriesEdit from "@/components/Main/Setup/Categories/VendorCategories/VendorCategoriesEdit"
//General
import AdjustmentsType from "@/components/Main/Setup/General/AdjustmentsType/AdjustmentsType"
import AdjustmentsTypeEdit from "@/components/Main/Setup/General/AdjustmentsType/AdjustmentsTypeEdit"
import CustomFields from "@/components/Main/Setup/General/CustomFields/CustomFields"
import CustomFieldsEdit from "@/components/Main/Setup/General/CustomFields/CustomFieldsEdit"
import GeneralTax from "@/components/Main/Setup/General/Taxes/Taxes"
import TaxesEdit from "@/components/Main/Setup/General/Taxes/TaxesEdit"
import GeneralWarehouse from "@/components/Main/Setup/General/Warehouses/Warehouses"
import WarehousesEdit from "@/components/Main/Setup/General/Warehouses/WarehousesEdit"
//Sales Geography
import Areas from "@/components/Main/Setup/SalesGeography/Areas/Areas"
import AreasEdit from "@/components/Main/Setup/SalesGeography/Areas/AreasEdit"
import Regions from "@/components/Main/Setup/SalesGeography/Regions/Regions"
import RegionsEdit from "@/components/Main/Setup/SalesGeography/Regions/RegionsEdit"
import SubAreas from "@/components/Main/Setup/SalesGeography/SubAreas/SubAreas"
import SubAreasEdit from "@/components/Main/Setup/SalesGeography/SubAreas/SubAreasEdit"
import Territories from "@/components/Main/Setup/SalesGeography/Territories/Territories"
import TerritoriesEdit from "@/components/Main/Setup/SalesGeography/Territories/TerritoriesEdit"
import Zones from "@/components/Main/Setup/SalesGeography/Zones/Zones"
import ZonesEdit from "@/components/Main/Setup/SalesGeography/Zones/ZonesEdit"
//Groups
import Branch from "@/components/Main/Setup/Groups/Branches/Branch"
import BranchesEdit from "@/components/Main/Setup/Groups/Branches/BranchesEdit"

import AppDashboard from '../AppDashboard'

//-------------------------------------------------------Knowledge Base-------------------------------------------------------------
import KB from "@/components/Main/KB";
import KBGlobalSearch from "@/components/Main/KB/KBGlobalSearch";
//import KBPageOne from "@/components/Main/KB/PageOne";
import ArticleEdit from "@/components/Main/KB/Article/ArticleEdit";

Vue.use(Router);

export default new Router({
  //mixins: [mixins],
  routes: [
    {
      path: "/KB",
      component: KB,
      children: [
        {
          path: "/",
          component: KBGlobalSearch,
          name: "KB",
        },
        {
          path: "/KB/ArticleEdit",
          component: ArticleEdit,
          name: "ArticleEdit",
        },
      ]
    },
    {
      path: '/',
      component: AppDashboard,
      children: [
        // {
        //   path: "/Quotation",
        //   name: "Quotation",
        //   component: Quotation
        // },
        // {
        //   path: "/CategoryBrand",
        //   component: CategoryBrand,
        //   name: "CategoryBrand",
        // },
        // {
        //   path: "/CategoryBrand",
        //   component: CategoryCustomer,
        //   name: "CategoryBrand",
        // },
        // {
        //   path: "/CategoryBrand",
        //   component: CategoryBrand,
        //   name: "CategoryBrand",
        // },
        // {
        //   path: "/CategoryBrand",
        //   component: CategoryBrand,
        //   name: "CategoryBrand",
        // },
        // {
        //   path: "/CategoryBrand",
        //   component: CategoryBrand,
        //   name: "CategoryBrand",
        // },
        {
          path: "/",
          component: Dashboard,
          name: "Dashboard",
        },

        {
          path: "/SaleQuotation",
          component: SaleQuotation,
          name: "SaleQuotation",
        },
        {
          path: "/SaleOrder",
          component: SaleOrder,
          name: "SaleOrder",
        },
        {
          path: "/Delivery",
          component: Delivery,
          name: "Delivery",
        },
        {
          path: "/DeliveryEdit",
          name: "DeliveryEdit",
          component: DeliveryEdit,
        },
        {
          path: "/Invoice",
          name: "Invoice",
          component: Invoice,
        },
        {
          path: "/InvoiceEdit",
          name: "InvoiceEdit",
          component: InvoiceEdit,
        },
        {
          path: "/Order",
          name: "Order",
          component: Order,
        },
        {
          path: "/OrderEdit",
          name: "OrderEdit",
          component: OrderEdit,
        },
        {
          path: "/Quotation",
          name: "Quotation",
          component: Quotation,
        },
        {
          path: "/QuotationEdit",
          name: "QuotationEdit",
          component: QuotationEdit,
        },
        {
          path: "/SaleReceiveMoney",
          name: "SaleReceiveMoney",
          component: SaleReceiveMoney,
        },
        {
          path: "/SaleReceiveMoneyEdit",
          name: "SaleReceiveMoneyEdit",
          component: SaleReceiveMoneyEdit,
        },
        {
          path: "/RecurringInvoice",
          name: "RecurringInvoice",
          component: RecurringInvoice,
        },
        {
          path: "/RecurringInvoiceEdit",
          name: "RecurringInvoiceEdit",
          component: RecurringInvoiceEdit,
        },
        {
          path: "/Refund",
          name: "Refund",
          component: Refund,
        },
        {
          path: "/RefundEdit",
          name: "RefundEdit",
          component: RefundEdit,
        },
        {
          path: "/SaleReturn",
          name: "SaleReturn",
          component: Return,
        },
        {
          path: "/SaleReturnEdit",
          name: "SaleReturnEdit",
          component: ReturnEdit,
        },
        {
          path: "/Settlement",
          name: "Settlement",
          component: Settlement,
        },
        {
          path: "/SettlementEdit",
          name: "SettlementEdit",
          component: SettlementEdit,
        },

        {
          path: "/PurchaseInvoice",
          name: "PurchaseInvoice",
          component: PurchaseInvoice,
        },
        {
          path: "/PurchaseInvoiceEdit",
          name: "PurchaseInvoiceEdit",
          component: PurchaseInvoiceEdit,
        },
        {
          path: "/PurchaseReturn",
          name: "PurchaseReturn",
          component: PurchaseReturn,
        },
        {
          path: "/PurchaseReturnEdit",
          name: "PurchaseReturnEdit",
          component: PurchaseReturnEdit,
        },
        {
          path: "/PurchaseRefund",
          name: "PurchaseRefund",
          component: PurchaseRefund,
        },
        {
          path: "/PurchaseRefundEdit",
          name: "PurchaseRefundEdit",
          component: PurchaseRefundEdit,
        },

        {
          path: "/MakePayment",
          name: "Make Payment",
          component: MakePayment,
        },
        {
          path: "/MakePaymentEdit",
          name: "MakePaymentEdit",
          component: MakePaymentEdit,
        },
        //List//////////////////////////////////////////
        {
          path: "/Customers",
          name: "Customers",
          component: Customers,
        },
        {
          path: "/CustomersEdit",
          name: "CustomersEdit",
          component: CustomersEdit,
        },
        {
          path: "/Employees",
          name: "Employees",
          component: Employees,
        },
        {
          path: "/EmployeesEdit",
          name: "EmployeesEdit",
          component: EmployeesEdit,
        },
        {
          path: "/Products",
          name: "Products",
          component: Products,
        },
        {
          path: "/ProductsEdit",
          name: "ProductsEdit",
          component: ProductsEdit,
        },
        {
          path: "/SalesPerson",
          name: "SalesPerson",
          component: SalesPerson,
        },
        {
          path: "/SalesPersonEdit",
          name: "SalesPersonEdit",
          component: SalesPersonEdit,
        },
        {
          path: "/Vendors",
          name: "Vendors",
          component: Vendors,
        },
        {
          path: "/VendorsEdit",
          name: "VendorsEdit",
          component: VendorsEdit,
        },
        {
          path: "/CategoryBrand",
          name: "CategoryBrand",
          component: CategoryBrand,
        },
        {
          path: "/BrandsEdit",
          name: "BrandsEdit",
          component: BrandsEdit,
        },

        {
          path: "/CategoryCustomer",
          name: "CategoryCustomer",
          component: CategoryCustomer,
        },
        {
          path: "/CustomerCategoriesEdit",
          name: "CustomerCategoriesEdit",
          component: CustomerCategoriesEdit,
        },
        {
          path: "/CategoryDepartment",
          name: "CategoryDepartment",
          component: CategoryDepartment,
        },
        {
          path: "/DepartmentsEdit",
          name: "DepartmentsEdit",
          component: DepartmentsEdit,
        },
        {
          path: "/CategoryDesignation",
          name: "CategoryDesignation",
          component: CategoryDesignation,
        },
        {
          path: "/DesignationEdit",
          name: "DesignationEdit",
          component: DesignationEdit,
        },
        {
          path: "/CategoryProduct",
          name: "CategoryProduct",
          component: CategoryProduct,
        },
        {
          path: "/ProductCategoriesEdit",
          name: "ProductCategoriesEdit",
          component: ProductCategoriesEdit,
        },
        {
          path: "/CategoryVendor",
          name: "CategoryVendor",
          component: CategoryVendor,
        },
        {
          path: "/VendorCategoriesEdit",
          name: "VendorCategoriesEdit",
          component: VendorCategoriesEdit,
        },
        {
          path: "/AdjustmentsType",
          name: "AdjustmentsType",
          component: AdjustmentsType,
        },
        {
          path: "/AdjustmentsTypeEdit",
          name: "AdjustmentsTypeEdit",
          component: AdjustmentsTypeEdit,
        },
        {
          path: "/CustomFields",
          name: "CustomFields",
          component: CustomFields,
        },
        {
          path: "/CustomFieldsEdit",
          name: "CustomFieldsEdit",
          component: CustomFieldsEdit,
        },
        {
          path: "/GeneralTax",
          name: "GeneralTax",
          component: GeneralTax,
        },
        {
          path: "/TaxesEdit",
          name: "TaxesEdit",
          component: TaxesEdit,
        },
        {
          path: "/GeneralWarehouse",
          name: "GeneralWarehouse",
          component: GeneralWarehouse,
        },
        {
          path: "/WarehousesEdit",
          name: "WarehousesEdit",
          component: WarehousesEdit,
        },
        {
          path: "/Areas",
          name: "Areas",
          component: Areas,
        },
        {
          path: "/AreasEdit",
          name: "AreasEdit",
          component: AreasEdit,
        },
        {
          path: "/Regions",
          name: "Regions",
          component: Regions,
        },
        {
          path: "/RegionsEdit",
          name: "RegionsEdit",
          component: RegionsEdit,
        },
        {
          path: "/SubAreas",
          name: "SubAreas",
          component: SubAreas,
        },
        {
          path: "/SubAreasEdit",
          name: "SubAreasEdit",
          component: SubAreasEdit,
        },
        {
          path: "/Territories",
          name: "Territories",
          component: Territories,
        },
        {
          path: "/TerritoriesEdit",
          name: "TerritoriesEdit",
          component: TerritoriesEdit,
        },
        {
          path: "/Zones",
          name: "Zones",
          component: Zones,
        },
        {
          path: "/ZonesEdit",
          name: "ZonesEdit",
          component: ZonesEdit,
        },
        {
          path: "/Branch",
          name: "Branch",
          component: Branch,
        },
        {
          path: "/BranchessEdit",
          name: "BranchesEdit",
          component: BranchesEdit,
        },

        {
          path: "/Expense",
          name: "Expense",
          component: Expense,
        },
        {
          path: "/ExpenseEdit",
          name: "ExpenseEdit",
          component: ExpenseEdit,
        },


        {
          path: "/JournalEntry",
          name: "JournalEntry",
          component: JournalEntry,
        },
        {
          path: "/JournalEntryEdit",
          name: "JournalEntryEdit",
          component: JournalEntryEdit,
        },

        {
          path: "/StockMovement",
          name: "StockMovement",
          component: StockMovement,
        },
        {
          path: "/StockMovementEdit",
          name: "StockMovementEdit",
          component: StockMovementEdit,
        },


        {
          path: "/StockAdjustment",
          name: "StockAdjustment",
          component: StockAdjustment,
        },
        {
          path: "/StockAdjustmentEdit",
          name: "StockAdjustmentEdit",
          component: StockAdjustmentEdit,
        },


        // otherwise redirect to home
        //{ path: "*", redirect: "/" }

      ]
    }
  ]
});
