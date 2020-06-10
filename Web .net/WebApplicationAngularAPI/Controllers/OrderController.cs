using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApplicationAngularAPI.Models;

namespace WebApplicationAngularAPI.Controllers
{
    public class OrderController : ApiController
    {
        private BDModels db = new BDModels();

        // GET: api/Order
        public System.Object GetOrder()
        {
            var result = (from a in db.Order
                          join b in db.Customer on a.CustomerID equals b.CustomerID


                          select new
                          {
                              a.OrderID,
                              a.OrderNo,
                              Customer = b.Name,
                              a.GTotal
                          }).ToList();

            return result;
        }

        // GET: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult GetOrder(long id)
        {

            var order = (from a in db.Order
                         where a.OrderID == id

                         select new
                         {
                             a.OrderID,
                             a.OrderNo,
                             a.CustomerID,
                             a.GTotal,
                             DeletedOrderItemIDs = "" 
                         }).FirstOrDefault();

            var orderDetalle = (from a in db.OrderItem
                                join b in db.Item on a.ItemID equals b.ItemID
                                where a.OrderID == id

                                select new
                                {
                                    a.OrderID,
                                    a.OrderItemID,
                                    a.ItemID,
                                    ItemName = b.Name,
                                    b.Price,
                                    a.Quantity,
                                    Total = a.Quantity * b.Price
                                }).ToList();

            return Ok(new { order, orderDetalle });
           
        }

        // POST: api/Order
        [ResponseType(typeof(Order))]
        public IHttpActionResult PostOrder(Order order)
        {
            //cambie la estructura del codigo
            try
            {
                // Orden Tabla
                if (order.OrderID == 0)
                {
                    db.Order.Add(order);
                }
                else
                {
                    db.Entry(order).State = EntityState.Modified;
                }
                

                //Orden Items Tabla
                foreach (var item in order.OrderItem)
                {
                    if (item.OrderItemID == 0)
                    {
                        db.OrderItem.Add(item);
                    }
                    else
                    {
                        db.Entry(item).State = EntityState.Modified;

                    }
                    
                }

                //borrar por oirderItem

                foreach (var id in order.DeletedOrderItemIDs.Split(','). Where( x => x!= ""))
                {
                    OrderItem x = db.OrderItem.Find(Convert.ToInt64(id));
                    db.OrderItem.Remove(x);
                }

                db.SaveChanges();



                return Ok();

            }
            catch (Exception x)
            {

                throw x;
            }

            
        }

        // DELETE: api/Order/5
        [ResponseType(typeof(Order))]
        public IHttpActionResult DeleteOrder(long id)
        {
            Order order = db.Order.Include( y => y.OrderItem)
                .SingleOrDefault(x => x.OrderID == id);

            foreach (var item in order.OrderItem.ToList())
            {
                db.OrderItem.Remove(item);
            }

            db.Order.Remove(order);
            db.SaveChanges();

            return Ok(order);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool OrderExists(long id)
        {
            return db.Order.Count(e => e.OrderID == id) > 0;
        }
    }
}