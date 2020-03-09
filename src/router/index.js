import Vue from "vue";
import Router from "vue-router";

import Home from "@/components/Main/Home/Home";

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

import ReceiveMoney from "@/components/Main/Sale/ReceiveMoney/ReceiveMoney"
import ReceiveMoneyEdit from "@/components/Main/Sale/ReceiveMoney/ReceiveMoneyEdit"

import RecurringInvoice from "@/components/Main/Sale/RecurringInvoice/RecurringInvoice"
import RecurringInvoiceEdit from "@/components/Main/Sale/RecurringInvoice/RecurringInvoiceEdit"

import Refund from "@/components/Main/Sale/Refund/Refund"
import RefundEdit from "@/components/Main/Sale/Refund/RefundEdit"

import Return from "@/components/Main/Sale/Return/Return"
import ReturnEdit from "@/components/Main/Sale/Return/ReturnEdit"

import Settlement from "@/components/Main/Sale/Settlement/Settlement"
import SettlementEdit from "@/components/Main/Sale/Settlement/SettlementEdit"
//SETUPS:
//LIST:
import Customers from "@/components/Main/Setup/List/Customers/Customers"
import CustomersEdit from "@/components/Main/Setup/List/Customers/CustomersEdit"
import Employees from "@/components/Main/Setup/List/Employees/Employees"
import EmployeesEdit from "@/components/Main/Setup/List/Employees/EmployeesEdit"
import Products from "@/components/Main/Setup/List/Products/Products"
import ProductsEdit from "@/components/Main/Setup/List/Products/ProductsEdit"
import SalesPersons from "@/components/Main/Setup/List/SalesPersons/SalesPersons"
import SalesPersonsEdit from "@/components/Main/Setup/List/SalesPersons/SalesPersonsEdit"
import Vendors from "@/components/Main/Setup/List/Vendors/Vendors"
import VendorsEdit from "@/components/Main/Setup/List/Vendors/VendorsEdit"
//SETUPS:
//CATEGORIES:
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
//SETUPS:
//General:
import AdjustmentsType from "@/components/Main/Setup/General/AdjustmentsType/AdjustmentsType"
import AdjustmentsTypeEdit from "@/components/Main/Setup/General/AdjustmentsType/AdjustmentsTypeEdit"
import CustomFields from "@/components/Main/Setup/General/CustomFields/CustomFields"
import CustomFieldsEdit from "@/components/Main/Setup/General/CustomFields/CustomFieldsEdit"
import GeneralTax from "@/components/Main/Setup/General/Taxes/Taxes"
import TaxesEdit from "@/components/Main/Setup/General/Taxes/TaxesEdit"
import GeneralWarehouse from "@/components/Main/Setup/General/Warehouses/Warehouses"
import WarehousesEdit from "@/components/Main/Setup/General/Warehouses/WarehousesEdit"
//SETUPS:
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
//SETUPS:
//GROUPS:
import Branches from "@/components/Main/Setup/Groups/Branches/Branches"
import BranchesEdit from "@/components/Main/Setup/Groups/Branches/BranchesEdit"

//import Quotation from "@/components/Main/Sale/Quotation/Quotation";

import AllTickets from "@/components/Main/AllTicket/AllTickets";
import AllTicketTest from "@/components/Main/AllTicket/AllTicketTest";
import Priority from "@/components/Main/Priority/Priority";
import TicketSearch from "@/components/Main/TicketSearch/TicketSearch";

import ITInventory from "@/components/Main/ITInventory/ITInventory";
import AdministrativeRight from "@/components/Main/AdministrativeRight/AdministrativeRight";

import Pending from "@/components/Main/Pending/Pending";
import Feedback from "@/components/Main/Feedback/Feedback";
import FirstResponseSLA from "@/components/Main/FirstResponseSLA/FirstResponseSLA";

import MetAndBreached from "@/components/Main/TicketStatusWise/MetAndBreached";
import Login from "@/components/Main/Login";
//import Test from "@/components/Main/Test";
//import Form1 from "@/components/Main/Form1";
import Ticket from "@/components/Main/Ticket";

//Administration
import User from "@/components/Main//User/User";
import DefineAnalyst from "@/components/Main//DefineAnalyst/DefineAnalyst";
import UserGroup from "@/components/Main/UserGroup/UserGroup";
import RoleUserRight from "@/components/Main/RoleUserRight/RoleUserRight";
import TrendChart from "@/components/Main/TrendNew/TrendChart";
import TrendChartNew from "@/components/Main/TrendNew/TrendChartNew";
import Tree from "@/components/Main/RoleUserRight/Tree";

//Configuration
import Ftag from "@/components/Other/Ftag";
import MassNotification from "@/components/Main/MassNotification/MassNotification";
import QualityIndicator from "@/components/Main/QualityIndicator/QualityIndicator";
import UnrecordedCall from "@/components/Main/UnrecordedCall/UnrecordedCall";
//import ServiceDeskStatistics from "@/components/Other/ServiceDeskStatistics";
import ServiceDeskStatistic from "@/components/Main/ServiceDeskStatistic/ServiceDeskStatistics";

import DefineSupportGroup from "@/components/Main/Configuration/DefineSupportGroup";
import DefineLocation from "@/components/Main/Configuration/DefineLocation";
import DefineUser from "@/components/Main/Configuration/DefineUser";

//import PunctualityKPI from "@/components/Other/PunctualityKPI";

import AnalystKPI from "@/components/Main/AnalystKPI/AnalystKPI";
import PunctualityKPI from "@/components/Main/AnalystKPI/PunctualityKPI";
import CallToTicketKPI from "@/components/Main/AnalystKPI/CallToTicketKPI";
import QualityIndicatorKPI from "@/components/Main/AnalystKPI/QualityIndicatorKPI";

import AgentStatistics from "@/components/Main/AnalystKPI/AgentStatistics";

import QualityControlCategory from "@/components/Main/QualityControlCategory/QualityControlCategory";
import Task from "@/components/Main/Task/Task";

import AppDashboard from '../AppDashboard'

//-------------------------------------------------------Knowledge Base-------------------------------------------------------------
import KB from "@/components/Main/KB";
import KBGlobalSearch from "@/components/Main/KB/KBGlobalSearch";
import KBTest from "@/components/Main/KB/Test";
//import KBPageOne from "@/components/Main/KB/PageOne";
import KBTreeView from "@/components/Main/KB/KBTreeView/KBTreeView";
import Article from "@/components/Main/KB/Article/Article";
import ArticleEdit from "@/components/Main/KB/Article/ArticleEdit";
import FavoriteArticle from "@/components/Main/KB/FavoriteArticle/FavoriteArticle";
import KBUserGroup from "@/components/Main/KB/UserGroup/UserGroup";
import KBRoleUserRight from "@/components/Main/KB/RoleUserRight/RoleUserRight";
import KBUser from "@/components/Main/KB/User/User";

import ArticleRequestNotification from "@/components/Main/KB/ArticleRequestNotification/ArticleRequestNotification"


//Noman Rajani
import Tier2 from "@/components/Main/NomanRajani/Tier-2";
import Tier3 from "@/components/Main/NomanRajani/Tier-3";

import Test from "@/components/Main/NomanRajani/Test";
import CrystalReport from "@/components/Main/NomanRajani/CrystalReport";
import CrystalReportEmail from "@/components/Main/NomanRajani/CrystalReportEmail";
import CallScoreCard from "@/components/Main/NomanRajani/CallScoreCard";
//import PageOne from '@/components/PageOne'
//import MenuSubheaders from '@/components/MenuSubheaders'
//import TreeView from '@/components/TreeView'
//import AllTicket from '@/components/AllTicket'

import UserGroup2 from "@/components/Main/UserGroup/UserGroup2";

Vue.use(Router);

//import Vue from "vue";
import store from "../store";
import axios from "axios";
//import { mixins } from "../mixins/CustomMixins";


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
          path: "/ReceiveMoney",
          name: "ReceiveMoney",
          component: ReceiveMoney,
        },
        {
          path: "/ReceiveMoneyEdit",
          name: "ReceiveMoneyEdit",
          component: ReceiveMoneyEdit,
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
          path: "/Return",
          name: "Return",
          component: Return,
        },
        {
          path: "/ReturnEdit",
          name: "ReturnEdit",
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
        //SETUP:
        //LIST:
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
          path: "/SalesPersons",
          name: "SalesPersons",
          component: SalesPersons,
        },
        {
          path: "/SalesPersonsEdit",
          name: "SalesPersonsEdit",
          component: SalesPersonsEdit,
        },
        // {
        //   path: "/CategoryVendor",
        //   name: "CategoryVendor",
        //   component: CategoryVendor,
        // },
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
          path: "/Branches",
          name: "Branches",
          component: Branches,
        },
        {
          path: "/BranchessEdit",
          name: "BranchesEdit",
          component: BranchesEdit,
        },

        // otherwise redirect to home
        //{ path: "*", redirect: "/" }

      ]
    }
  ]
});
