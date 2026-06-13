import os

file_path = r'f:\BrokBuddy\brokbuddy\templates\UAE\template-skyline-04\src\components\shared\property-detail-page-client.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Beds and Baths replacement
old_beds = """                  <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-muted-foreground" /> <span>{property.bedrooms || 'Studio'} Beds</span></div>
                  <Separator orientation="vertical" className="h-5" />
                  <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-muted-foreground" /> <span>{property.bathrooms} Baths</span></div>
                  <Separator orientation="vertical" className="h-5 hidden sm:block" />"""

new_beds = """                  {property.bedrooms > 0 ? (
                    <>
                      <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-muted-foreground" /> <span>{property.bedrooms} Beds</span></div>
                      <Separator orientation="vertical" className="h-5" />
                    </>
                  ) : property.type === 'Studio' || property.category === 'Studio' ? (
                    <>
                      <div className="flex items-center gap-2"><BedDouble className="w-5 h-5 text-muted-foreground" /> <span>Studio</span></div>
                      <Separator orientation="vertical" className="h-5" />
                    </>
                  ) : null}
                  {property.bathrooms > 0 && (
                    <>
                      <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-muted-foreground" /> <span>{property.bathrooms} Baths</span></div>
                      <Separator orientation="vertical" className="h-5 hidden sm:block" />
                    </>
                  )}"""

content = content.replace(old_beds, new_beds)

# Floor plans replacement
old_desc = """              <AnimateOnScroll delay={200}>
                <h2 className="text-3xl font-headline mb-4">Description</h2>
                <ReadMore text={property.description} />
              </AnimateOnScroll>"""

new_desc = """              <AnimateOnScroll delay={200}>
                <h2 className="text-3xl font-headline mb-4">Description</h2>
                <ReadMore text={property.description} />
              </AnimateOnScroll>

              {property.floorPlans && property.floorPlans.length > 0 && (
                <>
                  <Separator className="my-12" />
                  <AnimateOnScroll delay={250}>
                    <h2 className="text-3xl font-headline mb-4">Floor Plans</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {property.floorPlans.map((fp, idx) => (
                        <div key={idx} className="space-y-3">
                          {fp.title && <h3 className="font-semibold text-lg">{fp.title}</h3>}
                          <div className="relative aspect-[16/9] w-full border rounded-lg overflow-hidden bg-muted/20">
                            <Image src={fp.url} alt={fp.title || 'Floor Plan'} fill className="object-contain" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </AnimateOnScroll>
                </>
              )}"""

content = content.replace(old_desc, new_desc)

# Regulatory replacement
old_reg = """              <AnimateOnScroll delay={400}>
                <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent" /> Regulatory Information</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2"><HandHelping className="w-4 h-4 mt-0.5" /> <strong>Reference ID:</strong> {property.referenceId || 'N/A'}</li>
                      <li className="flex gap-2"><Banknote className="w-4 h-4 mt-0.5" /> <strong>Trakheesi:</strong> {property.trakheesi || 'N/A'}</li>
                      <li className="flex gap-2"><LandPlot className="w-4 h-4 mt-0.5" /> <strong>RERA Permit:</strong> {property.reraPermit || 'N/A'}</li>
                    </ul>
                  </div>
                  <div className="text-center w-full flex flex-col items-center sm:w-auto sm:items-end">
                    <p className="text-sm font-bold mb-2">DLD Permit</p>
                    {qrCodeUrl ? (
                      <Image src={qrCodeUrl} alt="DLD Permit QR Code" width={100} height={100} />
                    ) : (
                      <div className="w-[100px] h-[100px] bg-muted animate-pulse" />
                    )}
                  </div>
                </div>
              </AnimateOnScroll>"""

new_reg = """              <AnimateOnScroll delay={400}>
                <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-accent" /> Regulatory Information</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {(property.trakheesi || property.dldPermitNo || property.reraPermit) && (
                        <li className="flex gap-2"><HandHelping className="w-4 h-4 mt-0.5" /> <strong>Permit Number:</strong> {property.trakheesi || property.dldPermitNo || property.reraPermit}</li>
                      )}
                      {property.reraPermit && (
                        <li className="flex gap-2"><LandPlot className="w-4 h-4 mt-0.5" /> <strong>RERA Project Number:</strong> {property.reraPermit}</li>
                      )}
                      {displayAgent?.brn && (
                        <li className="flex gap-2"><Banknote className="w-4 h-4 mt-0.5" /> <strong>BRN Number:</strong> {displayAgent.brn}</li>
                      )}
                    </ul>
                  </div>
                  {property.dldPermitLink && (
                    <div className="text-center w-full flex flex-col items-center sm:w-auto sm:items-end shrink-0 p-2 border bg-muted/20 rounded-md">
                      <Image src={property.dldPermitLink} alt="DLD Permit QR Code" width={100} height={100} className="object-contain" />
                    </div>
                  )}
                </div>
              </AnimateOnScroll>"""

content = content.replace(old_reg, new_reg)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
